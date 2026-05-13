package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.auth.AuthResponseDto;
import com.learnix.backend.model.dto.auth.LoginRequestDto;
import com.learnix.backend.model.dto.auth.RegisterRequestDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto dto);

    AuthResponseDto login(LoginRequestDto dto);
}

