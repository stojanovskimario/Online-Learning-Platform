package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.enums.SubscriptionTier;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.auth.AuthResponseDto;
import com.learnix.backend.model.dto.auth.LoginRequestDto;
import com.learnix.backend.model.dto.auth.RegisterRequestDto;
import com.learnix.backend.model.enums.UserRole;
import com.learnix.backend.security.JwtService;
import com.learnix.backend.service.application.AuthService;
import com.learnix.backend.service.domain.UserService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponseDto register(RegisterRequestDto dto) {
        String email = normalizeEmail(dto.email());
        String username = normalizeUsername(dto.username());
        
        if (userService.findByEmail(email).isPresent()) {
            throw new RuntimeException("A user with email %s already exists.".formatted(email));
        }
        
        if (userService.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username %s is already taken.".formatted(username));
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(dto.password()));
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setRole(UserRole.STUDENT);
        user.setSubscriptionTier(SubscriptionTier.FREE);
        user.setAiMessagesToday(0);

        User savedUser = userService.save(user);
        String token = jwtService.generateToken(savedUser);
        return AuthResponseDto.from(token, savedUser);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        String email = normalizeEmail(dto.email());
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(dto.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);
        return AuthResponseDto.from(token, user);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeUsername(String username) {
        return username == null ? null : username.trim().toLowerCase(Locale.ROOT);
    }
}

