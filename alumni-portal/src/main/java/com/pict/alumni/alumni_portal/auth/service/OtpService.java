package com.pict.alumni.alumni_portal.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;

    public String generateAndStoreOtp(String email) {

        email =email.trim().toLowerCase();
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        redisTemplate.opsForValue()
                .set("OTP:" + email, otp, Duration.ofMinutes(5));

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {

        email = email.trim().toLowerCase();

        String storedOtp =
                redisTemplate.opsForValue().get("OTP:" + email);

        if (storedOtp == null) return false;

        if (storedOtp.equals(otp)) {

            redisTemplate.delete("OTP:" + email);

            // ✅ IMPORTANT FIX
            markEmailVerified(email);

            return true;
        }

        return false;
    }
//
//    public void markEmailVerified(String email){
//        redisTemplate.opsForValue()
//                .set("VERIFIED:"+ email,"true",Duration.ofMinutes(10));
//    }
//    public boolean isEmailVerified(String email){
//        email = email.trim().toLowerCase();   // ✅ FIX
//        return redisTemplate.hasKey("VERIFIED:"+email);
//    }

    public void markEmailVerified(String email){
        email = email.trim().toLowerCase(); // ✨ FIX: ensure it's normalized before setting Redis key
        redisTemplate.opsForValue()
                .set("VERIFIED:"+ email,"true",Duration.ofMinutes(10));
    }

    public boolean isEmailVerified(String email){
        email = email.trim().toLowerCase();
        // ✨ FIX: safe unboxing to prevent NullPointerException at runtime
        return Boolean.TRUE.equals(redisTemplate.hasKey("VERIFIED:"+email));
    }

    public void removeVerificationFlag(String email){
        email = email.trim().toLowerCase();   // ✅ FIX
        redisTemplate.delete("VERIFIED:" + email);
    }
}