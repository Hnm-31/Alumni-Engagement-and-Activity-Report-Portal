package com.pict.alumni.alumni_portal.dto.admin;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminReportResponse {

    private Long reportId;

    private String alumniName;
    private String sessionTitle;
    private String department;
    private String  academicYear;
    private Integer studentCount;

    private String uploadedByFaculty;
    private LocalDateTime uploadedAt;

    private List<FileResponse> files;
}