package com.pict.alumni.alumni_portal.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET =
            "pict-alumni-secret-key-pict-alumni-secret-key";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String email, String role ) {

        return Jwts.builder()
                .setSubject(email)
                .claim("role",role)
                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)
                )
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {

        try {
            extractAllClaims(token);

            return true;

        } catch (JwtException e) {
            return false;
        }

    }
    public String extractRole(String token ){
        return extractAllClaims(token)
                .get("role",String.class);


    }
}