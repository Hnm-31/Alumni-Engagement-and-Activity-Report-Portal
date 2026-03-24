package com.pict.alumni.alumni_portal.auth.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
//@Getter
//@Setter
public class VerifyOtpRequest {
    private String email;
    private String otp;
}