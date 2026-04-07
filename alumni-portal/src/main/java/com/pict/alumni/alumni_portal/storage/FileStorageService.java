package com.pict.alumni.alumni_portal.storage;

import com.pict.alumni.alumni_portal.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    FileUploadResponse uploadActivityReport(MultipartFile file,String storedname);

    FileUploadResponse uploadAdditionalDocument(MultipartFile file,String storedname);

    void deleteFile(String publicId);
}