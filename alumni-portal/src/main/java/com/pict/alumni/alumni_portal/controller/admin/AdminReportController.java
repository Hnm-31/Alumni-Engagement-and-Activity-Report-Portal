package com.pict.alumni.alumni_portal.controller.admin;


import com.pict.alumni.alumni_portal.entity.ReportFile;
import com.pict.alumni.alumni_portal.service.admin.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {

        String url = adminReportService.getDownloadUrl(fileId);

        return ResponseEntity.status(302)
                .header("Location", url)
                .build();
    }




}
