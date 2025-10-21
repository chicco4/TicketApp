package com.chicco.backend.controllers;

import static com.chicco.backend.util.JwtUtil.parseUserId;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.dtos.GetTicketResponseDto;
import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.mappers.TicketMapper;
import com.chicco.backend.services.TicketTypeService;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket-types")
public class TicketTypeController {

  private final TicketTypeService ticketTypeService;
  private final TicketMapper ticketMapper;

  @PostMapping("/{ticket-type-id}")
  public ResponseEntity<List<GetTicketResponseDto>> purchaseTicket(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-type-id") UUID ticketTypeId,
      @RequestParam(name = "quantity", defaultValue = "1") @Min(1) @Max(10) int quantity) {
    List<Ticket> savedTickets = ticketTypeService.purchaseTickets(parseUserId(jwt), ticketTypeId, quantity);
    List<GetTicketResponseDto> body = savedTickets.stream()
        .map(ticketMapper::toGetTicketResponseDto)
        .toList();

    ResponseEntity.BodyBuilder responseBuilder = savedTickets.size() == 1
        ? ResponseEntity.created(URI.create(String.format("/api/v1/tickets/%s", savedTickets.get(0).getId())))
        : ResponseEntity.status(HttpStatus.CREATED);

    return responseBuilder.body(body);
  }

}
