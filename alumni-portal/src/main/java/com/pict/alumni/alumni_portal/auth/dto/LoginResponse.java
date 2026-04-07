package com.pict.alumni.alumni_portal.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private Long facultyId;
    private String name;
    private String email;


    private String token;

}