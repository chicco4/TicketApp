package com.chicco.backend.services;

import java.util.UUID;

import com.chicco.backend.domain.entities.QrCode;
import com.chicco.backend.domain.entities.Ticket;

public interface QrCodeService {
  QrCode generateQrCode(Ticket ticket);

  byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
