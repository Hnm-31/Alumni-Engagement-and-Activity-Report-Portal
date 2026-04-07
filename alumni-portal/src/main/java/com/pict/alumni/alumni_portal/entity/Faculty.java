package com.pict.alumni.alumni_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "faculty",
        uniqueConstraints = {
                @UniqueConstraint(name = "faculty_email_unique", columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Role {
        ADMIN,
        FACULTY
    }
    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private Role role;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}