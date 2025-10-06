package com.chicco.backend.services;

import java.util.UUID;

import com.chicco.backend.domain.entities.TicketValidation;

public interface TicketValidationService {
  TicketValidation validateTicketByQrCode(UUID qrCodeId, UUID validatedByUserId);

  TicketValidation validateTicketManually(UUID ticketId, UUID validatedByUserId);
}
