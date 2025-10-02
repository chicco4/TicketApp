package com.chicco.backend.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chicco.backend.domain.entities.QrCode;
import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.entities.TicketValidation;
import com.chicco.backend.domain.enums.QrCodeStatusEnum;
import com.chicco.backend.domain.enums.TicketValidationMethodEnum;
import com.chicco.backend.domain.enums.TicketValidationStatusEnum;
import com.chicco.backend.exceptions.QrCodeNotFoundException;
import com.chicco.backend.exceptions.TicketNotFoundException;
import com.chicco.backend.repositories.QrCodeRepository;
import com.chicco.backend.repositories.TicketRepository;
import com.chicco.backend.repositories.TicketValidationRepository;
import com.chicco.backend.services.TicketValidationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

  private final QrCodeRepository qrCodeRepository;
  private final TicketValidationRepository ticketValidationRepository;
  private final TicketRepository ticketRepository;

  private TicketValidation validateTicket(Ticket ticket, TicketValidationMethodEnum method) {
    TicketValidation ticketValidation = new TicketValidation();
    ticketValidation.setTicket(ticket);
    ticketValidation.setMethod(method);

    TicketValidationStatusEnum ticketValidationStatus = ticket.getValidations().stream()
        .filter(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
        .findFirst()
        .map(v -> TicketValidationStatusEnum.INVALID)
        .orElse(TicketValidationStatusEnum.VALID);

    ticketValidation.setStatus(ticketValidationStatus);

    return ticketValidationRepository.save(ticketValidation);
  }

  @Override
  public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
    QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
        .orElseThrow(() -> new QrCodeNotFoundException(
            String.format("QR Code with id %s not found", qrCodeId)));

    Ticket ticket = qrCode.getTicket();

    return validateTicket(ticket, TicketValidationMethodEnum.QR_CODE);
  }

  @Override
  public TicketValidation validateTicketManually(UUID ticketId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new TicketNotFoundException());

    return validateTicket(ticket, TicketValidationMethodEnum.MANUAL);
  }

}
