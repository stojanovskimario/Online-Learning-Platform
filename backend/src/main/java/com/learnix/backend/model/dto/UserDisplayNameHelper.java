package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.User;

public final class UserDisplayNameHelper {
    private UserDisplayNameHelper() {
    }

    public static String getDisplayName(User user) {
        if (user == null) {
            return null;
        }
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        if (isBlank(firstName) || isBlank(lastName)) {
            return null;
        }
        return firstName.trim() + " " + lastName.trim();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

