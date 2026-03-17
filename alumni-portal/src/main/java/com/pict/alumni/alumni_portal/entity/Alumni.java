package com.pict.alumni.alumni_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "alumni",
        uniqueConstraints = {
                @UniqueConstraint(name = "alumni_email_key", columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alumni {

    @Id
    @Column(name = "enrollment_no", length = 50)
    private String enrollmentNo;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "middle_name", length = 50)
    private String middleName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "secondary_email", length = 100)
    private String secondaryEmail;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "secondary_phone", length = 20)
    private String secondaryPhone;

    @Column(name = "degree", length = 50)
    private String degree;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "sub_institute", length = 100)
    private String subInstitute;

    @Column(name = "joining_year")
    private Integer joiningYear;

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "current_company", length = 100)
    private String currentCompany;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}