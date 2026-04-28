package com.learnix.backend.web.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "OK";
    }
}


