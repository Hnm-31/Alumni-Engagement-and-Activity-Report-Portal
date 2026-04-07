package com.pict.alumni.alumni_portal.controller.faculty;

import com.pict.alumni.alumni_portal.dto.faculty.UpdateReportRequest;
import com.pict.alumni.alumni_portal.service.faculty.FacultyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.pict.alumni.alumni_portal.entity.ReportFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;


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

    // ⭐ FACULTY FILE DOWNLOAD
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        // 1. Get the authorized file (verifies ownership)
        ReportFile reportFile = facultyReportService.getAuthorizedFile(fileId);

        // 2. Fetch the raw bytes from Cloudinary URL (strip query params like ?fl_attachment)
        String cloudinaryUrl = reportFile.getFileUrl();
        if (cloudinaryUrl != null && cloudinaryUrl.contains("?")) {
            cloudinaryUrl = cloudinaryUrl.substring(0, cloudinaryUrl.indexOf("?"));
        }

        // Strip out the manually appended file extension
        if (cloudinaryUrl != null) {
            int dotIndex = cloudinaryUrl.lastIndexOf(".");
            int slashIndex = cloudinaryUrl.lastIndexOf("/");
            if (dotIndex > slashIndex) {
                cloudinaryUrl = cloudinaryUrl.substring(0, dotIndex);
            }
        }

        RestTemplate restTemplate = new RestTemplate();
        byte[] fileBytes = restTemplate.getForObject(cloudinaryUrl, byte[].class);

        String originalFilename = reportFile.getOriginalFileName();
        String contentType = determineContentType(originalFilename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + originalFilename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(fileBytes.length)
                .body(new ByteArrayResource(fileBytes));
    }

    private String determineContentType(String filename) {
        if (filename == null) return "application/octet-stream";
        if (filename.endsWith(".pdf"))  return "application/pdf";
        if (filename.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (filename.endsWith(".doc"))  return "application/msword";
        if (filename.endsWith(".csv"))  return "text/csv";
        if (filename.endsWith(".xls"))  return "application/vnd.ms-excel";
        if (filename.endsWith(".png"))  return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }


}