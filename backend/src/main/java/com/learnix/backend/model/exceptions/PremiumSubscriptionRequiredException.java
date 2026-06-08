package com.learnix.backend.model.exceptions;

public class PremiumSubscriptionRequiredException extends RuntimeException {
    public PremiumSubscriptionRequiredException() {
        super("You need a Premium subscription to enroll in this course.");
    }
}
