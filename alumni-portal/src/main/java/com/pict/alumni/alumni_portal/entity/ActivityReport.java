package com.pict.alumni.alumni_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "activity_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alumni_name", nullable = false, length = 150)
    private String alumniName;

    @Column(name = "session_title", nullable = false, length = 200)
    private String sessionTitle;

    @Column(name = "session_objective", columnDefinition = "TEXT")
    private String sessionObjective;

    @Column(name = "academic_year", length = 20)
    private String academicYear;

    @Column(length = 80)
    private String department;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "student_count")
    private Integer studentCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_by")
    private Long createdBy;   // faculty id (later relation)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ⭐ one report → many files
    @OneToMany(mappedBy = "activityReport",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ReportFile> files;

    @PrePersist
    public void onCreate(){
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}