package com.learnix.backend.model.dto.error;

public record ApiErrorResponse(
        int status,
        String message,
        Object data
) {
}

