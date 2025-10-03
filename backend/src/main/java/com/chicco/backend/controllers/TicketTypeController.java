package com.chicco.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.dtos.GetTicketResponseDto;
import com.chicco.backend.mappers.TicketMapper;
import com.chicco.backend.services.TicketTypeService;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import java.net.URI;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import static com.chicco.backend.util.JwtUtil.parseUserId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket-types")
public class TicketTypeController {

  private final TicketTypeService ticketTypeService;
  private final TicketMapper ticketMapper;

  @PostMapping("/{ticket-type-id}")
  public ResponseEntity<GetTicketResponseDto> purchaseTicket(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-type-id") UUID ticketTypeId) {
    // save the ticket and return a 201 Created with Location header to the new resource
    Ticket savedTicket = ticketTypeService.purchaseTicket(parseUserId(jwt), ticketTypeId);
    GetTicketResponseDto body = ticketMapper.toGetTicketResponseDto(savedTicket);
    return ResponseEntity.created(URI.create(String.format("/api/v1/tickets/%s", savedTicket.getId())))
        .body(body);
  }

}
