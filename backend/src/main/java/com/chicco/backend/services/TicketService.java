package com.chicco.backend.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.chicco.backend.domain.entities.Ticket;

public interface TicketService {
  Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable);

  Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId);

  byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
