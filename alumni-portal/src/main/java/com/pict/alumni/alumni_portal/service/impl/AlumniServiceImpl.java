package com.pict.alumni.alumni_portal.service.impl;


import com.pict.alumni.alumni_portal.entity.Alumni;
import com.pict.alumni.alumni_portal.exception.ResourceNotFoundException;
import com.pict.alumni.alumni_portal.repository.AlumniRepository;
import com.pict.alumni.alumni_portal.service.AlumniService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlumniServiceImpl implements AlumniService {

    private final AlumniRepository alumniRepository;

    @Override
    public Alumni saveOrUpdateAlumni(Alumni alumni) {

        // If already exists → update logic
        if (alumniRepository.existsByEnrollmentNo(alumni.getEnrollmentNo())) {

            Alumni existing = alumniRepository.findById(alumni.getEnrollmentNo())
                    .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));

            existing.setFirstName(alumni.getFirstName());
            existing.setMiddleName(alumni.getMiddleName());
            existing.setLastName(alumni.getLastName());
            existing.setEmail(alumni.getEmail());
            existing.setSecondaryEmail(alumni.getSecondaryEmail());
            existing.setPhoneNumber(alumni.getPhoneNumber());
            existing.setSecondaryPhone(alumni.getSecondaryPhone());
            existing.setDegree(alumni.getDegree());
            existing.setDepartment(alumni.getDepartment());
            existing.setSubInstitute(alumni.getSubInstitute());
            existing.setJoiningYear(alumni.getJoiningYear());
            existing.setPassingYear(alumni.getPassingYear());
            existing.setAddress(alumni.getAddress());
            existing.setCurrentCompany(alumni.getCurrentCompany());
            existing.setDesignation(alumni.getDesignation());

            return alumniRepository.save(existing);
        }

        // else new save
        return alumniRepository.save(alumni);
    }

    @Override
    public Alumni getAlumniByEnrollment(String enrollmentNo) {
        return alumniRepository.findById(enrollmentNo)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found with enrollment: " + enrollmentNo));
    }
}