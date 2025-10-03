package com.chicco.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.services.TicketTypeService;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import static com.chicco.backend.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/events/{event-id}/ticket-types")
public class TicketTypeController {

  private final TicketTypeService ticketTypeService;

  @PostMapping("/{ticket-type-id}")
  public ResponseEntity<Void> purchaseTicket(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-type-id") UUID ticketTypeId) {

    ticketTypeService.purchaseTicket(parseUserId(jwt), ticketTypeId);

    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
