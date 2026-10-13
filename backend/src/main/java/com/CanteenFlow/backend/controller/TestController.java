package com.CanteenFlow.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class TestController {

    @GetMapping("/")
    public String root() {
        return "CanteenFlow Backend API is Running Successfully! Access endpoints at /api/test or /api/food-items";
    }

    @GetMapping("/api/test")
    public String test() {
        return "CanteenFlow Backend is Working Successfully!";
    }
}

