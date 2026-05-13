package com.learnix.backend.service.domain;

import com.learnix.backend.model.domain.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    User save(User user);
}

