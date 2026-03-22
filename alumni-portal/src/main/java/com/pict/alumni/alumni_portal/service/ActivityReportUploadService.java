package com.pict.alumni.alumni_portal.service;

import com.pict.alumni.alumni_portal.dto.FileUploadResponse;
import com.pict.alumni.alumni_portal.entity.ActivityReport;
import com.pict.alumni.alumni_portal.entity.ReportFile;
import com.pict.alumni.alumni_portal.repository.ActivityReportRepository;
import com.pict.alumni.alumni_portal.repository.ReportFileRepository;
import com.pict.alumni.alumni_portal.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityReportUploadService {

    private final ActivityReportRepository reportRepository;
    private final ReportFileRepository fileRepository;
    private final FileStorageService storageService;

    @Transactional
    public Long uploadReport(

            String alumniName ,
            String sessionTitle,
            String sessionObjective,
            String academicYear,
            String department,
            Integer studentCount,
            MultipartFile mainFile,
            MultipartFile extraFile,
            Long facultyId


    ) {
        alumniName = alumniName.trim();
        department = department.trim();
        sessionTitle = sessionTitle.trim();

        // ⭐ STEP-1 create report metadata
        ActivityReport report = ActivityReport.builder()
                .alumniName(alumniName)
                .sessionTitle(sessionTitle)
                .sessionObjective(sessionObjective)
                .academicYear(academicYear)
                .department(department)
                .studentCount(studentCount)
                .createdBy(facultyId)
                .build();

        reportRepository.save(report);

        // ⭐ STEP-2 upload MAIN file
        if (mainFile != null && !mainFile.isEmpty()) {

            String storedName =
                    buildStructuredFileName(
                            alumniName,
                            department,
                            "MAIN",
                            mainFile.getOriginalFilename()
                    );

            FileUploadResponse upload =
                    storageService.uploadActivityReport(mainFile,storedName);

            ReportFile file = ReportFile.builder()
                    .fileUrl(upload.getFileUrl())
                    .publicId(upload.getPublicId())
                    .originalFileName(mainFile.getOriginalFilename())
                    .storedFileName(storedName)
                    .fileType("MAIN")
                    .activityReport(report)
                    .build();

            fileRepository.save(file);
        }

        // ⭐ STEP-3 upload EXTRA file
        if (extraFile != null && !extraFile.isEmpty()) {

            String storedName =
                    buildStructuredFileName(
                            alumniName,
                            department,
                            "EXTRA",
                            extraFile.getOriginalFilename()
                    );

            FileUploadResponse upload =
                    storageService.uploadAdditionalDocument(extraFile,storedName);

            ReportFile file = ReportFile.builder()
                    .fileUrl(upload.getFileUrl())
                    .publicId(upload.getPublicId())
                    .originalFileName(extraFile.getOriginalFilename())
                    .storedFileName(storedName)
                    .fileType("EXTRA")
                    .activityReport(report)
                    .build();

            fileRepository.save(file);
        }

        return report.getId();
    }

    // ⭐ structured naming logic
    private String buildStructuredFileName(
            String alumniName,
            String department,
            String type,
            String originalName
    ) {

        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        return LocalDate.now() + "_" +
                alumniName.replace(" ", "-") + "_" +
                department + "_" +
                type + "_" +
                UUID.randomUUID() +
                extension;
    }
}