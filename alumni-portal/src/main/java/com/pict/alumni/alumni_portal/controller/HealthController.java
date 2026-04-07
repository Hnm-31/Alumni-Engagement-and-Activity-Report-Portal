package com.pict.alumni.alumni_portal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "PICT Alumni Portal Backend is Running!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
