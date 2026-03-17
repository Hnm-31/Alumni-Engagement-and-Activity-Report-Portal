package com.pict.alumni.alumni_portal.service;


import com.pict.alumni.alumni_portal.entity.Alumni;

public interface AlumniService {

    Alumni saveOrUpdateAlumni(Alumni alumni);

    Alumni getAlumniByEnrollment(String enrollmentNo);
}