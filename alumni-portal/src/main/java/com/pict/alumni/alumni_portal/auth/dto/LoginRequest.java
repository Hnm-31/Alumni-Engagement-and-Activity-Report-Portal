package com.pict.alumni.alumni_portal.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;
}