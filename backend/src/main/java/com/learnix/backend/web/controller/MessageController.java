package com.learnix.backend.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

	@GetMapping("/api/message")
	public String message() {
		return "Idemoooo , povrzano e ss backend ako ga gledas ovoj hehe ";
	}
}

