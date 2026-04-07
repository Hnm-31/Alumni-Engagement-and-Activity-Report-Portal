package com.pict.alumni.alumni_portal.util;

import java.time.LocalDate;
import java.util.UUID;

public class FileUtil {


    public static String buildStructuredFileName(
            String alumniName,
            String department,
            String type,
            String originalName
    ) {
        // Extract extension safely
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
        }

        // Sanitize name segments at the source — before they enter storedname
        String safeName = sanitizeSegment(alumniName);
        String safeDept = sanitizeSegment(department);

        return LocalDate.now()
                + "_" + safeName
                + "_" + safeDept
                + "_" + type
                + "_" + UUID.randomUUID()
                + extension; // e.g. ".pdf" — clean, lowercase, never sanitized
    }

    private static String sanitizeSegment(String input) {
        if (input == null || input.isBlank()) return "unknown";
        return input.trim()
                .replaceAll("[&\\s]+", "_")
                .replaceAll("[^a-zA-Z0-9_\\-]", "")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
    }
}