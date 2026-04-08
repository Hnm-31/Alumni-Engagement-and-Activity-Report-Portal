package com.pict.alumni.alumni_portal.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpMail(String toEmail, String otp) {
        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", "Alumni Portal <onboarding@resend.dev>");
        body.put("to", toEmail);
        body.put("subject", "PICT Alumni Portal - OTP Verification");
        body.put("html", "<strong>Your OTP for Alumni Portal signup is: " + otp + "</strong><br>Valid for 5 minutes.");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Email sent successfully!");
            }
        } catch (Exception e) {
            System.err.println("Failed to send email via API: " + e.getMessage());
        }
    }
}
