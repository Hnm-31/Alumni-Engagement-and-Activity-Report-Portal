package com.pict.alumni.alumni_portal.service.admin;

import com.pict.alumni.alumni_portal.dto.admin.AdminReportResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminReportService {

    Page<AdminReportResponse> getAllReports(int page, int size);

    Page<AdminReportResponse> getReportsByDepartment(String dept, int page, int size);

    Page<AdminReportResponse> getReportsByYear(Integer year, int page, int size);

    List<AdminReportResponse> getFilesByReportId(Long reportId);

    String getDownloadUrl(Long fileId);
}