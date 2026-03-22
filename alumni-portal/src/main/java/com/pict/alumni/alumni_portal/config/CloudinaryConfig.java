package com.pict.alumni.alumni_portal.config;


import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @org.springframework.beans.factory.annotation.Value("${cloudinary.cloud.name}")
    private String cloudName;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.api.secret}")
    private String secretKey;

    @Value("${cloudinary.api.key}")
    private String accessKey;
    @Bean
    public Cloudinary cloudinary() {

        Map
                <String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", accessKey);
        config.put("api_secret", secretKey);

        return new Cloudinary(config);
    }


}
