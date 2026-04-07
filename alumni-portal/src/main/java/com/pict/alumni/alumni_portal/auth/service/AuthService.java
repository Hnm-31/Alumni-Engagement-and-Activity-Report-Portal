package com.pict.alumni.alumni_portal.auth.service;

import com.pict.alumni.alumni_portal.auth.dto.RegisterFacultyRequest;
import com.pict.alumni.alumni_portal.entity.Faculty;
import com.pict.alumni.alumni_portal.repository.FacultyRepository;
import com.pict.alumni.alumni_portal.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FacultyRepository facultyRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    public void register(RegisterFacultyRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        if(!otpService.isEmailVerified(email)){
            throw new RuntimeException("Email not OTP verified");
        }
        if (facultyRepository.existsByEmail(email)) {
            throw new RuntimeException("Faculty already exists");
        }

        Faculty faculty = Faculty.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .department(request.getDepartment())
                .role(Faculty.Role.FACULTY)
                .build();

        facultyRepository.save(faculty);
        otpService.removeVerificationFlag(email);
    }

    public String  login(String email, String password) {

        Faculty faculty = facultyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(password, faculty.getPassword())) {
            throw new RuntimeException("Invalid password");
        }


        return jwtService.generateToken(
                faculty.getEmail(),
                faculty.getRole().name()

        );
    }

    public void resetPassword(String email, String newPassword) {

        email = email.trim().toLowerCase();

        // ✅ check Redis flag
        if (!otpService.isEmailVerified(email)) {
            throw new RuntimeException("OTP not verified");
        }

        Faculty faculty = facultyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        faculty.setPassword(passwordEncoder.encode(newPassword));

        facultyRepository.save(faculty);

        // ✅ remove after use
        otpService.removeVerificationFlag(email);
    }
}