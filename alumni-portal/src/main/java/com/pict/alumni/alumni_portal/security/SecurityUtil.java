package com.pict.alumni.alumni_portal.security;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static String getLoggedInEmail(){
        Object principal =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();
        return principal.toString();
    }
}
