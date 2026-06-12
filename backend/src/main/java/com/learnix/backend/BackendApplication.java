package com.learnix.backend;

import com.learnix.backend.config.StripeProperties;
import com.learnix.backend.config.GoogleAiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties({StripeProperties.class, GoogleAiProperties.class})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
