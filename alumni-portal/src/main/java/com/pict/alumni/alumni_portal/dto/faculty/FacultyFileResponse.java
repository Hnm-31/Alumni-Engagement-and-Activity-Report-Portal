package com.pict.alumni.alumni_portal.dto.faculty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyFileResponse {

    private Long fileId;
    private String fileType;
    private String structuredFileName;
    private String fileUrl;
}