package com.pict.alumni.alumni_portal.service.admin;

import com.pict.alumni.alumni_portal.dto.admin.*;
import com.pict.alumni.alumni_portal.entity.*;
import com.pict.alumni.alumni_portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

    private final ActivityReportRepository reportRepo;
    private final ReportFileRepository reportFileRepository;


    @Override
    public Page<AdminReportResponse> getAllReports(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return reportRepo.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<AdminReportResponse> getReportsByDepartment(String dept, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return reportRepo.findByDepartment(dept, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<AdminReportResponse> getReportsByYear(Integer year, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return reportRepo.findByAcademicYear(year, pageable)
                .map(this::mapToResponse);
    }
    @Override

    public List<AdminReportResponse> getFilesByReportId(Long reportId) {

        ActivityReport report =
                reportRepo.findById(reportId)
                        .orElseThrow(() -> new RuntimeException("Report not found"));

        List<FileResponse> files =
                report.getFiles()
                        .stream()
                        .map(f -> FileResponse.builder()
                                .fileId(f.getId())
                                .fileType(f.getFileType())
                                .fileUrl(f.getFileUrl())
                                .structuredFileName(f.getStoredFileName())
                                .build()
                        ).toList();

        AdminReportResponse response =
                AdminReportResponse.builder()
                        .reportId(report.getId())
                        .alumniName(report.getAlumniName())
                        .sessionTitle(report.getSessionTitle())
                        .department(report.getDepartment())
                        .academicYear(report.getAcademicYear())
                        .studentCount(report.getStudentCount())
                        .uploadedByFaculty("FACULTY")
                        .uploadedAt(report.getCreatedAt())
                        .files(files)
                        .build();

        return List.of(response);
    }

    @Override
    public String getDownloadUrl(Long fileId) {

        ReportFile file = reportFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        return file.getFileUrl();
    }

    private AdminReportResponse mapToResponse(ActivityReport report) {

        return AdminReportResponse.builder()
                .reportId(report.getId())
                .alumniName(report.getAlumniName())
                .sessionTitle(report.getSessionTitle())
                .department(report.getDepartment())
                .academicYear(report.getAcademicYear())
                .studentCount(report.getStudentCount())
                .uploadedByFaculty("FACULTY")
                .uploadedAt(report.getCreatedAt())
                .files(
                        report.getFiles()
                                .stream()
                                .map(file -> FileResponse.builder()
                                        .fileId(file.getId())
                                        .fileType(file.getFileType())
                                        .fileUrl(file.getFileUrl())
                                        .structuredFileName(file.getStoredFileName())
                                        .build())
                                .collect(Collectors.toList())
                )
                .build();
    }

    @Override
    public ReportFile getFile(Long fileId){
        return reportFileRepository.findById(fileId)
                .orElseThrow(()->new RuntimeException("File Not Found"));

    }

}