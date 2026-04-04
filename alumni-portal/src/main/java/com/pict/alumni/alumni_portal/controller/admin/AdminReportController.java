package com.pict.alumni.alumni_portal.controller.admin;


import com.pict.alumni.alumni_portal.entity.ReportFile;
import com.pict.alumni.alumni_portal.repository.ReportFileRepository;
import com.pict.alumni.alumni_portal.service.admin.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminReportController {
    private final AdminReportService adminReportService;
    private final ReportFileRepository fileRepository;

    @GetMapping("/reports")

    public ResponseEntity<?> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ResponseEntity.ok(
                adminReportService.getAllReports(page,size)
        );
    }

    // ⭐ FILES OF REPORT
    @GetMapping("/reports/{reportId}/files")
    public ResponseEntity<?> getFiles(@PathVariable  Long reportId) {

        return ResponseEntity.ok(
                adminReportService.getFilesByReportId(reportId)
        );
    }

    // ⭐ DOWNLOAD
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        ReportFile reportFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Fetch the raw bytes from Cloudinary URL (strip query params like ?fl_attachment)
        String cloudinaryUrl = reportFile.getFileUrl(); 
        if (cloudinaryUrl != null && cloudinaryUrl.contains("?")) {
            cloudinaryUrl = cloudinaryUrl.substring(0, cloudinaryUrl.indexOf("?"));
        }
        
        // Strip out the manually appended file extension, as Cloudinary raw URLs don't have it
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
