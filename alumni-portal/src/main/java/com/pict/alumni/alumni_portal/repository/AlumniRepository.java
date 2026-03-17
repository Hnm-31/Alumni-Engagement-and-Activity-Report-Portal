package com.pict.alumni.alumni_portal.repository;

import com.pict.alumni.alumni_portal.entity.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, String> {

    // find by email (for validation / login / duplicate check)
    Optional<Alumni> findByEmail(String email);

    // check existence using enrollment
    boolean existsByEnrollmentNo(String enrollmentNo);

    // filtering support (future admin dashboard)
    List<Alumni> findByDepartment(String department);

    List<Alumni> findByPassingYear(Integer passingYear);

    List<Alumni> findByCurrentCompanyContainingIgnoreCase(String company);

    List<Alumni> findByDepartmentAndPassingYear(String department, Integer passingYear);

}