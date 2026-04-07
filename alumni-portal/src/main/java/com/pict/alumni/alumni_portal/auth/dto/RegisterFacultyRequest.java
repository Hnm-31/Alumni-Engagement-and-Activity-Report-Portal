package com.pict.alumni.alumni_portal.auth.dto;

import lombok.Data;

@Data
public class RegisterFacultyRequest {

    private String name;
    private String email;
    private String password;
    private String department;
//    public enum Role {
//        FACULTY,
//        ADMIN
//    }}
}