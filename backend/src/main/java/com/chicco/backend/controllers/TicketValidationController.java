package com.chicco.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.dtos.TicketValidationRequestDto;
import com.chicco.backend.domain.dtos.TicketValidationResponseDto;
import com.chicco.backend.domain.entities.TicketValidation;
import com.chicco.backend.domain.enums.TicketValidationMethodEnum;
import com.chicco.backend.mappers.TicketValidationMapper;
import com.chicco.backend.services.TicketValidationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

  private final TicketValidationService ticketValidationService;
  private final TicketValidationMapper ticketValidationMapper;

  @PostMapping
  public ResponseEntity<TicketValidationResponseDto> validateTicket(
      @RequestBody TicketValidationRequestDto ticketValidationRequestDto) {
    TicketValidationMethodEnum method = ticketValidationRequestDto.getMethod();

    TicketValidation ticketValidation;
    if (TicketValidationMethodEnum.MANUAL.equals(method)) {
      ticketValidation = ticketValidationService.validateTicketManually(ticketValidationRequestDto.getId());
    } else {
      ticketValidation = ticketValidationService.validateTicketByQrCode(ticketValidationRequestDto.getId());
    }

    return ResponseEntity.ok(
        ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
  }

}
