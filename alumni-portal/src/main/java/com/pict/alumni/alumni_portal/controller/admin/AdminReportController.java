package com.pict.alumni.alumni_portal.controller.admin;


import com.pict.alumni.alumni_portal.entity.ReportFile;
import com.pict.alumni.alumni_portal.service.admin.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminReportController {
    private final AdminReportService adminReportService;

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
//    @GetMapping("/files/{fileId}/download")
//    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {
//
//        String url = adminReportService.getDownloadUrl(fileId);
//
//        return ResponseEntity.status(302)
//                .header("Location", url)
//                .build();
//    }

    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long fileId) throws Exception {

        ReportFile file = adminReportService.getFile(fileId);

        URL url = new URL(file.getFileUrl());

        InputStreamResource resource =
                new InputStreamResource(url.openStream());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getStoredFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }




}
