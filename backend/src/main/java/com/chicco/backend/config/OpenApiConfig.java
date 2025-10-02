package com.chicco.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI springBootPersonsOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("Spring Boot Demo API")
            .version("1.0.0")
            .description("API REST di in un progetto Spring Boot con PostgreSQL."))
        .addServersItem(new Server()
            .url("http://localhost:8080")
            .description("Server locale di sviluppo"));
  }
}
