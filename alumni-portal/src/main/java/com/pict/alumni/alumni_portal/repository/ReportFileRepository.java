package com.pict.alumni.alumni_portal.repository;

import com.pict.alumni.alumni_portal.entity.ReportFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportFileRepository extends JpaRepository<ReportFile, Long> {

    // ⭐ get all files of a report
    List<ReportFile> findByActivityReportId(Long reportId);

}