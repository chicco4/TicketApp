package com.chicco.backend.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.entities.TicketType;
import com.chicco.backend.domain.entities.User;
import com.chicco.backend.domain.enums.TicketStatusEnum;
import com.chicco.backend.exceptions.TicketSoldOutException;
import com.chicco.backend.exceptions.TicketTypeNotFoundException;
import com.chicco.backend.exceptions.UserNotFoundException;
import com.chicco.backend.repositories.TicketRepository;
import com.chicco.backend.repositories.TicketTypeRepository;
import com.chicco.backend.repositories.UserRepository;
import com.chicco.backend.services.TicketTypeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

  private final UserRepository userRepository;
  private final TicketTypeRepository ticketTypeRepository;
  private final TicketRepository ticketRepository;

  @Override
  @Transactional
  public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
    // Reuse the new method for backward compatibility
    return purchaseTickets(userId, ticketTypeId, 1).get(0);
  }

  @Override
  @Transactional
  public List<Ticket> purchaseTickets(UUID userId, UUID ticketTypeId, int quantity) {
    if (quantity < 1) {
      throw new IllegalArgumentException("Quantity must be at least 1");
    }

    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
        String.format("User with id %s not found", userId)));

    TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
        .orElseThrow(() -> new TicketTypeNotFoundException(
            String.format("Ticket type with id %s not found", ticketTypeId)));

    int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);

    Integer totalAvailable = ticketType.getTotalAvailable();
    // if totalAvailable is null => treat as unlimited
    if (totalAvailable != null && purchasedTickets + quantity > totalAvailable) {
      int remaining = totalAvailable - purchasedTickets;
      throw new TicketSoldOutException(
          String.format("Only %d ticket(s) available, but %d were requested", remaining, quantity));
    }

    // Create multiple tickets
    List<Ticket> tickets = new ArrayList<>();
    for (int i = 0; i < quantity; i++) {
      Ticket ticket = new Ticket();
      ticket.setStatus(TicketStatusEnum.PURCHASED);
      ticket.setTicketType(ticketType);
      ticket.setPurchaser(user);
      tickets.add(ticket);
    }

    return ticketRepository.saveAll(tickets);
  }

}
