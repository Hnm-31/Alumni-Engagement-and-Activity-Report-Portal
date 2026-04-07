package com.pict.alumni.alumni_portal.controller.faculty;

import com.pict.alumni.alumni_portal.dto.faculty.UpdateReportRequest;
import com.pict.alumni.alumni_portal.service.faculty.FacultyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyReportController {

    private final FacultyReportService facultyReportService;

    @GetMapping("/reports")
    public ResponseEntity<?> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                facultyReportService.getMyReports(page, size)
        );
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<?> getMyReportById(@PathVariable Long id) {

        return ResponseEntity.ok(
                facultyReportService.getMyReportById(id)
        );
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<?> updateMyReport(
            @PathVariable Long id,
            @RequestBody UpdateReportRequest request
    ) {

        facultyReportService.updateMyReport(id, request);

        return ResponseEntity.ok("Report updated successfully");
    }

    @PutMapping(value = "/reports/{reportId}/files/{fileId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> replaceFile(
            @PathVariable Long reportId,
            @PathVariable Long fileId,
            @RequestParam MultipartFile file
    ) {

        facultyReportService.replaceFile(reportId, fileId, file);

        return ResponseEntity.ok("File replaced successfully");
    }


}