package com.pict.alumni.alumni_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "report_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "stored_file_name", length = 255)
    private String storedFileName;

    @Column(name = "public_id", nullable = false, length = 255)
    private String publicId;

    @Column(name = "structured_file_name",length = 255)
    private String structuredFileName;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "file_type", length = 20,nullable=false)
    private String fileType;   // MAIN / EXTRA

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    // ⭐ Many files → one report
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private ActivityReport activityReport;

    @PrePersist
    public void onUpload(){
        this.uploadedAt = LocalDateTime.now();
    }
}