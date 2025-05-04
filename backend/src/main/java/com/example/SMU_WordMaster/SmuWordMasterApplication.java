package com.example.SMU_WordMaster;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmuWordMasterApplication {
	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("C:/SMU_WordMaster/SMU_WordMaster/backend/.env")
				.filename(".env")
				.load();

		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(SmuWordMasterApplication.class, args);
	}

}
