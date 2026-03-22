package com.pict.alumni.alumni_portal.controller;

import com.pict.alumni.alumni_portal.dto.admin.AdminReportResponse;
import com.pict.alumni.alumni_portal.service.ActivityReportUploadService;
import com.pict.alumni.alumni_portal.service.admin.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ActivityReportController {

    private final ActivityReportUploadService uploadService;
    private final AdminReportService adminReportService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )

    public ResponseEntity<?> uploadReport(

            @RequestParam String alumniName,
            @RequestParam String sessionTitle,
            @RequestParam(required = false) String sessionObjective,
            @RequestParam String academicYear,
            @RequestParam String department,
            @RequestParam(required = false) Integer studentCount,

            @RequestParam MultipartFile mainFile,
            @RequestParam(required = false) MultipartFile extraFile

    ) {

        // ⭐ Temporary faculty id (later from JWT / login session)
        Long facultyId = 1L;

        Long reportId = uploadService.uploadReport(
                alumniName,
                sessionTitle,
                sessionObjective,
                academicYear,
                department,
                studentCount,
                mainFile,
                extraFile,
                facultyId
        );

        return ResponseEntity.ok(
                "Report uploaded successfully. ReportId = " + reportId
        );
    }
}

