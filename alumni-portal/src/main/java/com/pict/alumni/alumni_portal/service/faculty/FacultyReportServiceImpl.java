package com.pict.alumni.alumni_portal.service.faculty;

import com.pict.alumni.alumni_portal.dto.FileUploadResponse;
import com.pict.alumni.alumni_portal.dto.faculty.*;
import com.pict.alumni.alumni_portal.entity.ActivityReport;
import com.pict.alumni.alumni_portal.entity.Faculty;
import com.pict.alumni.alumni_portal.entity.ReportFile;
import com.pict.alumni.alumni_portal.repository.ActivityReportRepository;
import com.pict.alumni.alumni_portal.repository.FacultyRepository;
import com.pict.alumni.alumni_portal.repository.ReportFileRepository;
import com.pict.alumni.alumni_portal.security.SecurityUtil;
import com.pict.alumni.alumni_portal.storage.FileStorageService;
import com.pict.alumni.alumni_portal.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FacultyReportServiceImpl implements FacultyReportService {

    private final ActivityReportRepository reportRepository;
    private final FacultyRepository facultyRepository;
    private final ReportFileRepository reportFileRepository;
    private final FileStorageService fileStorageService;

    @Override
    public FacultyReportResponse getMyReportById(Long reportId) {

        String email = SecurityUtil.getLoggedInEmail();

        Faculty faculty =
                facultyRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));

        ActivityReport report =
                reportRepository.findById(reportId)
                        .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getCreatedBy().equals(faculty.getId())) {
            throw new RuntimeException("You are not allowed to view this report");
        }

        return mapToResponse(report);
    }

    @Override
    public Page<FacultyReportResponse> getMyReports(int page, int size) {

        String email = SecurityUtil.getLoggedInEmail();

        Faculty faculty =
                facultyRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Pageable pageable =
                PageRequest.of(page, size, Sort.by("createdAt").descending());

        return reportRepository
                .findByCreatedBy(faculty.getId(), pageable)
                .map(this::mapToResponse);
    }

    private FacultyReportResponse mapToResponse(ActivityReport report) {

        return FacultyReportResponse.builder()
                .reportId(report.getId())
                .alumniName(report.getAlumniName())
                .sessionTitle(report.getSessionTitle())
                .department(report.getDepartment())
                .academicYear(report.getAcademicYear())
                .studentCount(report.getStudentCount())
                .uploadedAt(report.getCreatedAt())
                .files(
                        report.getFiles()
                                .stream()
                                .map(f -> FacultyFileResponse.builder()
                                        .fileId(f.getId())
                                        .fileType(f.getFileType())
                                        .structuredFileName(f.getStoredFileName())
                                        .fileUrl(f.getFileUrl())
                                        .build())
                                .toList()
                )
                .build();
    }

    @Override
    public void updateMyReport(Long reportId, UpdateReportRequest request) {

        String email = SecurityUtil.getLoggedInEmail();

        Faculty faculty =
                facultyRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));

        ActivityReport report =
                reportRepository.findById(reportId)
                        .orElseThrow(() -> new RuntimeException("Report not found"));

        // ⭐ Ownership validation
        if (!report.getCreatedBy().equals(faculty.getId())) {
            throw new RuntimeException("You cannot edit this report");
        }

        // ⭐ Update fields only if not null
        if (request.getAlumniName() != null)
            report.setAlumniName(request.getAlumniName().trim());

        if (request.getSessionTitle() != null)
            report.setSessionTitle(request.getSessionTitle().trim());

        if (request.getSessionObjective() != null)
            report.setSessionObjective(request.getSessionObjective());

        if (request.getAcademicYear() != null)
            report.setAcademicYear(request.getAcademicYear());

        if (request.getDepartment() != null)
            report.setDepartment(request.getDepartment());

        if (request.getStudentCount() != null)
            report.setStudentCount(request.getStudentCount());

        reportRepository.save(report);
    }

    @Override
    @Transactional
    public void replaceFile(Long reportId, Long fileId, MultipartFile newFile) {

        String email = SecurityUtil.getLoggedInEmail();

        Faculty faculty = facultyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        ActivityReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // ⭐ Ownership validation
        if (!report.getCreatedBy().equals(faculty.getId())) {
            throw new RuntimeException("You cannot modify this report");
        }

        ReportFile file = reportFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // ⭐ Ensure file belongs to report
        if (!file.getActivityReport().getId().equals(reportId)) {
            throw new RuntimeException("File does not belong to this report");
        }

        // ⭐ STEP-1 delete old file from Cloudinary
        fileStorageService.deleteFile(file.getPublicId());

        // ⭐ STEP-2 generate new structured name
        String storedName = FileUtil.buildStructuredFileName(
                report.getAlumniName(),
                report.getDepartment(),
                file.getFileType(),
                newFile.getOriginalFilename()
        );

        // ⭐ STEP-3 upload new file
        FileUploadResponse upload;

        if ("MAIN".equals(file.getFileType())) {
            upload = fileStorageService.uploadActivityReport(newFile, storedName);
        } else {
            upload = fileStorageService.uploadAdditionalDocument(newFile, storedName);
        }

        // ⭐ STEP-4 update DB
        file.setFileUrl(upload.getFileUrl());
        file.setPublicId(upload.getPublicId());
        file.setOriginalFileName(newFile.getOriginalFilename());
        file.setStoredFileName(storedName);

        reportFileRepository.save(file);
    }
}