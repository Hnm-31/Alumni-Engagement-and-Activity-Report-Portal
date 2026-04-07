package com.pict.alumni.alumni_portal.dto.faculty;

import lombok.Data;

@Data
public class UpdateReportRequest {

    private String alumniName;
    private String sessionTitle;
    private String sessionObjective;
    private String academicYear;
    private String department;
    private Integer studentCount;
}