package com.pict.alumni.alumni_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponse {

    private String fileUrl;
    private String publicId;
    private String originalFileName;
    private long size;
}