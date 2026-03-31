package com.pict.alumni.alumni_portal.dto.faculty;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FacultyReportResponse {

    private Long reportId;
    private String alumniName;
    private String sessionTitle;
    private String department;
    private String academicYear;
    private Integer studentCount;
    private LocalDateTime uploadedAt;

    private List<FacultyFileResponse> files;
}