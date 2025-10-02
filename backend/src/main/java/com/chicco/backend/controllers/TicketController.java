package com.chicco.backend.controllers;

import static com.chicco.backend.util.JwtUtil.parseUserId;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.dtos.GetTicketResponseDto;
import com.chicco.backend.domain.dtos.ListTicketResponseDto;
import com.chicco.backend.mappers.TicketMapper;
import com.chicco.backend.services.QrCodeService;
import com.chicco.backend.services.TicketService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

  private final TicketService ticketService;
  private final TicketMapper ticketMapper;
  private final QrCodeService qrCodeService;

  @GetMapping()
  public Page<ListTicketResponseDto> listTickets(
      @AuthenticationPrincipal Jwt jwt,
      Pageable pageable) {

    return ticketService.listTicketsForUser(parseUserId(jwt), pageable)
        .map(ticketMapper::toListTicketResponseDto);
  }

  @GetMapping("/{ticket-id}")
  public ResponseEntity<GetTicketResponseDto> getTicket(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-id") UUID ticketId) {
    return ticketService
        .getTicketForUser(parseUserId(jwt), ticketId)
        .map(ticketMapper::toGetTicketResponseDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/{ticket-id}/qr-codes")
  public ResponseEntity<byte[]> getTicketQrCode(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("ticket-id") UUID ticketId) {

    byte[] qrCodeImage = qrCodeService.getQrCodeImageForUserAndTicket(
        parseUserId(jwt),
        ticketId);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_PNG);
    headers.setContentLength(qrCodeImage.length);
    return ResponseEntity.ok()
        .headers(headers)
        .body(qrCodeImage);
  }

}
