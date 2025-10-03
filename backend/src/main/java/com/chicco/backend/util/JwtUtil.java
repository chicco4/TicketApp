package com.chicco.backend.util;

import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import com.chicco.backend.exceptions.InvalidJwtSubjectException;

public final class JwtUtil {
  private JwtUtil() {
  }

  public static UUID parseUserId(Jwt jwt) {
    try {
      return UUID.fromString(jwt.getSubject());
    } catch (IllegalArgumentException | NullPointerException ex) {
      throw new InvalidJwtSubjectException("Unable to parse JWT subject as UUID", ex);
    }
  }
}
