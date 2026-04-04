package com.pict.alumni.alumni_portal.dto.faculty;


import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}