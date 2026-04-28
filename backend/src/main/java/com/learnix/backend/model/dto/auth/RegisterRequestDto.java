package com.learnix.backend.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @NotBlank(message = "Email is required.")
        @Email(message = "Email should be valid.")
        String email,

        @NotBlank(message = "Password is required.")
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.")
        String password,

        @Size(max = 255, message = "First name must be up to 255 characters.")
        String firstName,

        @Size(max = 255, message = "Last name must be up to 255 characters.")
        String lastName
) {
}

