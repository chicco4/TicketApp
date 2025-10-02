package com.chicco.backend.services.impl;

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
import com.chicco.backend.services.QrCodeService;
import com.chicco.backend.services.TicketTypeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

  private final UserRepository userRepository;
  private final TicketTypeRepository ticketTypeRepository;
  private final TicketRepository ticketRepository;
  private final QrCodeService qrCodeService;

  @Override
  @Transactional
  public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
        String.format("User with id %s not found", userId)));

    TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
        .orElseThrow(() -> new TicketTypeNotFoundException(
            String.format("Ticket type with id %s not found", ticketTypeId)));

    int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);

    Integer totalAvailable = ticketType.getTotalAvailable();
    // if totalAvailable is null => treat as unlimited
    if (totalAvailable != null && purchasedTickets + 1 > totalAvailable) {
      throw new TicketSoldOutException();
    }

    Ticket ticket = new Ticket();
    ticket.setStatus(TicketStatusEnum.PURCHASED);
    ticket.setTicketType(ticketType);
    ticket.setPurchaser(user);

    Ticket savedTicket = ticketRepository.save(ticket);
    qrCodeService.generateQrCode(savedTicket);
    return savedTicket;
  }

}
