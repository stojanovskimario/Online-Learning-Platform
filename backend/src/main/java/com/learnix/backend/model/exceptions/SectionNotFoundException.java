package com.learnix.backend.model.exceptions;

public class SectionNotFoundException extends RuntimeException {
    public SectionNotFoundException(Long id) {
        super("A section with id %d does not exist.".formatted(id));
    }
}

