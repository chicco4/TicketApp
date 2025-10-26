package com.chicco.backend.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {

  @Override
  public JwtAuthenticationToken convert(Jwt jwt) {
    Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
    return new JwtAuthenticationToken(jwt, authorities);
  }

  private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {

    Set<String> roles = new LinkedHashSet<>();

    Map<String, Object> realmAccess = jwt.getClaim("realm_access");
    if (realmAccess != null) {
      roles.addAll(extractRoleCollection(realmAccess.get("roles")));
    }

    Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
    if (resourceAccess != null) {
      for (Object resource : resourceAccess.values()) {
        if (resource instanceof Map<?, ?> resourceMap) {
          roles.addAll(extractRoleCollection(((Map<?, ?>) resourceMap).get("roles")));
        }
      }
    }

    if (roles.isEmpty()) {
      return Collections.emptyList();
    }

    List<GrantedAuthority> authorities = new ArrayList<>(roles.size());
    for (String role : roles) {
      String authority = normalizeRole(role);
      if (authority != null) {
        authorities.add(new SimpleGrantedAuthority(authority));
      }
    }
    return authorities;
  }

  private Collection<String> extractRoleCollection(Object rolesObject) {
    if (!(rolesObject instanceof Collection<?> rolesCollection)) {
      return Collections.emptyList();
    }

    List<String> roles = new ArrayList<>();
    for (Object roleObj : rolesCollection) {
      if (roleObj instanceof String role && !role.isBlank()) {
        roles.add(role);
      }
    }
    return roles;
  }

  private String normalizeRole(String role) {
    if (role == null) {
      return null;
    }
    String trimmed = role.trim();
    if (trimmed.isEmpty()) {
      return null;
    }

    String upper = trimmed.toUpperCase();
    if (!upper.startsWith("ROLE_")) {
      upper = "ROLE_" + upper;
    }
    return upper;
  }
}
