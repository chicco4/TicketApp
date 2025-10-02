package com.chicco.backend.filters;

import static com.chicco.backend.util.JwtUtil.parseUserId;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.chicco.backend.domain.entities.User;
import com.chicco.backend.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter {

  private final UserRepository userRepository;

  @SuppressWarnings("null")
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    // TODO: implement user provisioning logic here

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null
        && authentication.isAuthenticated()
        && authentication.getPrincipal() instanceof Jwt jwt) {

      UUID keycloakId = parseUserId(jwt);

      if (!userRepository.existsById(keycloakId)) {

        User user = new User();
        user.setId(keycloakId);
        user.setUsername(jwt.getClaimAsString("preferred_username"));
        user.setEmail(jwt.getClaimAsString("email"));
        // Authentication is handled by Keycloak; store a placeholder to satisfy DB
        // constraint.
        user.setPassword("");

        userRepository.save(user);
      }
    }

    filterChain.doFilter(request, response);
  }

}
