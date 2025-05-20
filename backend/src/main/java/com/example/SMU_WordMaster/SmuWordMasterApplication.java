package com.example.SMU_WordMaster;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class SmuWordMasterApplication {
	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("C:\\Users\\jihyo\\바탕 화면\\SM_WordMaster\\backend")
				.filename(".env")
				.load();

		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));

		SpringApplication.run(SmuWordMasterApplication.class, args);
	}

}
