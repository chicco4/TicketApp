package com.chicco.backend.services;

import java.util.List;
import java.util.UUID;

import com.chicco.backend.domain.entities.Ticket;

public interface TicketTypeService {
  Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
  
  List<Ticket> purchaseTickets(UUID userId, UUID ticketTypeId, int quantity);
}
