package com.pict.alumni.alumni_portal.auth.Controller;

import com.pict.alumni.alumni_portal.auth.dto.*;
import com.pict.alumni.alumni_portal.auth.service.AuthService;
import com.pict.alumni.alumni_portal.auth.service.EmailService;
import com.pict.alumni.alumni_portal.auth.service.OtpService;
import com.pict.alumni.alumni_portal.dto.faculty.ResetPasswordRequest;
import com.pict.alumni.alumni_portal.entity.Faculty;
import com.pict.alumni.alumni_portal.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final EmailService emailService;
    private final AuthService authService;
    private final JwtService jwtService;

    // ⭐ Send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {

        String otp = otpService.generateAndStoreOtp(request.getEmail());
        emailService.sendOtpMail(request.getEmail(), otp);

        return ResponseEntity.ok("OTP sent successfully");
    }

    // ⭐ Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {

//        boolean valid = otpService.verifyOtp(
//                request.getEmail(),
//                request.getOtp()
//        );
//
//        if (!valid) {
//            return ResponseEntity.badRequest().body("Invalid OTP");
//        }
//
//        return ResponseEntity.ok("OTP verified");
        if(otpService.verifyOtp(request.getEmail(),request.getOtp())){
            otpService.markEmailVerified(request.getEmail());
            return ResponseEntity.ok("OTP verified. You can register now.");

        }
        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    // ⭐ Register Faculty
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterFacultyRequest request
    ) {

        authService.register(request);

        return ResponseEntity.ok("Faculty registered successfully");
    }

    // ⭐ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

       String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );


        return ResponseEntity.ok(token);
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
         String email = request.getEmail().trim().toLowerCase();

        authService.resetPassword(
                email,
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password reset successfully");
    }
}