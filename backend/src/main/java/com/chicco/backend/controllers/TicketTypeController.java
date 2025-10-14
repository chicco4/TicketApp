package com.chicco.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.dtos.GetTicketResponseDto;
import com.chicco.backend.mappers.TicketMapper;
import com.chicco.backend.services.TicketTypeService;

import lombok.RequiredArgsConstructor;

import java.util.List;
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
  public ResponseEntity<?> purchaseTickets(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-type-id") UUID ticketTypeId,
      @RequestParam(defaultValue = "1") int quantity) {
    
    List<Ticket> savedTickets = ticketTypeService.purchaseTickets(
        parseUserId(jwt), ticketTypeId, quantity);
    
    // Return single ticket response for backward compatibility when quantity is 1
    if (quantity == 1) {
      GetTicketResponseDto body = ticketMapper.toGetTicketResponseDto(savedTickets.get(0));
      return ResponseEntity.created(URI.create(String.format("/api/v1/tickets/%s", savedTickets.get(0).getId())))
          .body(body);
    } else {
      // Return list of tickets when quantity > 1
      List<GetTicketResponseDto> dtos = savedTickets.stream()
          .map(ticketMapper::toGetTicketResponseDto)
          .toList();
      return ResponseEntity.created(URI.create("/api/v1/tickets"))
          .body(dtos);
    }
  }

}
