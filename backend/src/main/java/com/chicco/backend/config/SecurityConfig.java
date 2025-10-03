package com.chicco.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
// import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import com.chicco.backend.filters.UserProvisioningFilter;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http,
      UserProvisioningFilter userProvisioningFilter,
      JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/docs/**", "/scalar/**", "/swagger-ui/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll() // public endpoints
            .requestMatchers("/api/v1/events/**").hasRole("ORGANIZER")
            .requestMatchers("/api/v1/ticket-validations/**").hasRole("STAFF")
            // catch-all rule, any request must be authenticated
            .anyRequest().authenticated())
        .csrf(AbstractHttpConfigurer::disable) // recommended non-deprecated form
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(oauth2 -> oauth2
            // .jwt(Customizer.withDefaults()) // current style for JWT resource
            // server
            .jwt(jwt -> jwt
                .jwtAuthenticationConverter(
                    jwtAuthenticationConverter))) // custom converter to extract roles from token
        .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class);

    return http.build();
  }
}
