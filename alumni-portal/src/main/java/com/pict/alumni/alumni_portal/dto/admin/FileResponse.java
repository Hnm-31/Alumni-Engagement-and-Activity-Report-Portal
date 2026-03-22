package com.pict.alumni.alumni_portal.dto.admin;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileResponse {

    private Long fileId;
    private String fileType;
    private String fileUrl;
    private String structuredFileName;
}