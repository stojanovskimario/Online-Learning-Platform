package com.learnix.backend.model.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("A user with id %d does not exist.".formatted(id));
    }
}

