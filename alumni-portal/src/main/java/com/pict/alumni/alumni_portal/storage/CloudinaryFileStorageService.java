package com.pict.alumni.alumni_portal.storage;

import com.cloudinary.Cloudinary;
import com.pict.alumni.alumni_portal.dto.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryFileStorageService implements FileStorageService {

    private final Cloudinary cloudinary;
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Override
    public FileUploadResponse uploadActivityReport(MultipartFile file, String storedname) {
        validateFile(file);
        return uploadToCloudinary(file, "alumni/activity-reports", storedname);
    }

    @Override
    public FileUploadResponse uploadAdditionalDocument(MultipartFile file, String storedname) {
        validateFile(file);
        return uploadToCloudinary(file, "alumni/additional-docs", storedname);
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, Map.of(
                    "resource_type", "raw",
                    "invalidate", true
            ));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from cloud", e);
        }
    }

    private FileUploadResponse uploadToCloudinary(MultipartFile file, String folder, String storedname) {
        try {
            // ── Step 1: Split extension ────────────────────────────────────────────
            int dotIndex = storedname.lastIndexOf(".");
            if (dotIndex == -1)
                throw new IllegalArgumentException("storedname has no extension: " + storedname);

            String nameWithoutExt = storedname.substring(0, dotIndex);
            String extension = storedname.substring(dotIndex).toLowerCase(); // e.g. ".pdf"

            // ── Step 2: Sanitize ───────────────────────────────────────────────────
            String sanitizedName = nameWithoutExt
                    .replaceAll("[&\\s]+", "_")
                    .replaceAll("[^a-zA-Z0-9_\\-]", "")
                    .replaceAll("_+", "_")
                    .replaceAll("^_|_$", "");

            String publicId = folder + "/" + sanitizedName;

            // ── Step 3: Upload ─────────────────────────────────────────────────────
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("public_id", publicId);
            uploadParams.put("resource_type", "raw");
            uploadParams.put("overwrite", false);

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            String uploadedPublicId = result.get("public_id").toString();
            String secureUrl = result.get("secure_url").toString();

            String originalFilename = (file.getOriginalFilename() != null)
                    ? file.getOriginalFilename()
                    : sanitizedName + extension;

            // Return the pristine native Cloudinary secure_url instead of hacking the string
            return new FileUploadResponse(
                    secureUrl,
                    uploadedPublicId,
                    originalFilename,
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
            throw new IllegalArgumentException("File size exceeds 10MB limit");

        String type = file.getContentType();
        if (type == null)
            throw new IllegalArgumentException("Could not determine file type");

        boolean allowed =
                type.equals("application/pdf") ||
                        type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                        type.equals("application/msword") ||
                        type.equals("text/csv") ||
                        type.equals("application/vnd.ms-excel") ||
                        type.equals("image/png") ||
                        type.equals("image/jpeg");

        if (!allowed)
            throw new IllegalArgumentException("Unsupported file type: " + type);
    }
}