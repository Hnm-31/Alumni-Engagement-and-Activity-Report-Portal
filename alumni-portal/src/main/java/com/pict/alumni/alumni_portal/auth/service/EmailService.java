package com.pict.alumni.alumni_portal.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendOtpMail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("PICT Alumni Portal - OTP Verification");
        message.setText(
                "Your OTP for Alumni Portal signup is: " + otp +
                        "\nValid for 5 minutes."
        );

        javaMailSender.send(message);
    }
}