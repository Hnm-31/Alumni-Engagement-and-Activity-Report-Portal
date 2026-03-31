package com.pict.alumni.alumni_portal.storage;

import com.cloudinary.Cloudinary;
import com.pict.alumni.alumni_portal.dto.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryFileStorageService implements FileStorageService {

    private final Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    @Override
    public FileUploadResponse uploadActivityReport(MultipartFile file,String storedname) {

        validateFile(file);

        return uploadToCloudinary(file, "alumni/activity-reports",storedname);
    }

    @Override
    public FileUploadResponse uploadAdditionalDocument(MultipartFile file,String storedname) {

        validateFile(file);

        return uploadToCloudinary(file, "alumni/additional-docs",storedname);
    }

    @Override
    public void deleteFile(String publicId) {

        try {
            cloudinary.uploader().destroy(publicId, Map.of(
                    "resource_type", "raw"
            ));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from cloud", e);
        }
    }

    private FileUploadResponse uploadToCloudinary(
            MultipartFile file,
            String folder,
            String storedName
    ) {

        try {

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "public_id", storedName,   // ⭐ only filename
                            "folder", folder,          // ⭐ folder separate
                            "resource_type", "raw",
                            "use_filename", true,
                            "unique_filename", false
                    )
            );

            return new FileUploadResponse(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString(),
                    file.getOriginalFilename(),
                    file.getSize()
            );

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }


    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty())
            throw new IllegalArgumentException("File must not be empty");

        if (file.getSize() > MAX_FILE_SIZE)
            throw new IllegalArgumentException("File size exceeds 10MB");

        String type = file.getContentType();
        if(type ==null){
            throw new RuntimeException("Unknown file type");
        }


        boolean allowed =
                type.equals("application/pdf") ||
                        type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                        type.equals("application/msword") ||
                        type.equals("text/csv") ||
                        type.equals("application/vnd.ms-excel") ||
                        type.equals("image/png") ||
                        type.equals("image/jpeg");

        if (!allowed) {
            throw new RuntimeException("Unsupported file type");
        }
    }
}