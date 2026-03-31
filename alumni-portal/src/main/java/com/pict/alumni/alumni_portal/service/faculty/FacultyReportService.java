package com.pict.alumni.alumni_portal.service.faculty;

import com.pict.alumni.alumni_portal.dto.faculty.FacultyReportResponse;
import com.pict.alumni.alumni_portal.dto.faculty.UpdateReportRequest;
import org.springframework.data.domain.Page;

public interface FacultyReportService {

    Page<FacultyReportResponse> getMyReports(int page, int size);

    FacultyReportResponse getMyReportById(Long reportId);

    void updateMyReport(Long reportId, UpdateReportRequest request);
}