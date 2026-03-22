package com.pict.alumni.alumni_portal.repository;

import com.pict.alumni.alumni_portal.entity.ActivityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityReportRepository extends JpaRepository<ActivityReport, Long> {

    Page<ActivityReport> findAll(Pageable pageable);

    Page<ActivityReport> findByDepartment(String department, Pageable pageable);

    Page<ActivityReport> findByAcademicYear(Integer academicYear, Pageable pageable);
}