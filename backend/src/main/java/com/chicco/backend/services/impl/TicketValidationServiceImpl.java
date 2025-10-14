package com.chicco.backend.services.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.entities.TicketValidation;
import com.chicco.backend.domain.enums.TicketStatusEnum;
import com.chicco.backend.domain.enums.TicketValidationMethodEnum;
import com.chicco.backend.domain.enums.TicketValidationStatusEnum;
import com.chicco.backend.exceptions.TicketNotFoundException;
import com.chicco.backend.repositories.TicketRepository;
import com.chicco.backend.repositories.UserRepository;
import com.chicco.backend.repositories.TicketValidationRepository;
import com.chicco.backend.services.TicketValidationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

  private final TicketValidationRepository ticketValidationRepository;
  private final TicketRepository ticketRepository;
  private final UserRepository userRepository;

  private static final int VALIDATION_COOLDOWN_MINUTES = 5;

  private TicketValidation validateTicket(Ticket ticket, TicketValidationMethodEnum method, UUID validatedByUserId) {
    TicketValidation ticketValidation = new TicketValidation();
    ticketValidation.setTicket(ticket);
    ticketValidation.setMethod(method);
    
    // Set the staff user who validated the ticket
    userRepository.findById(validatedByUserId).ifPresent(ticketValidation::setValidatedBy);

    // Determine validation status with comprehensive checks
    TicketValidationStatusEnum status = determineValidationStatus(ticket);
    ticketValidation.setStatus(status);

    return ticketValidationRepository.save(ticketValidation);
  }

  /**
   * Determines the validation status of a ticket based on multiple factors:
   * - Ticket status (cancelled tickets are invalid)
   * - Event timing (expired events, too early entries)
   * - Duplicate scan prevention (5-minute cooldown)
   * - Re-entry policy (currently allows re-entry after cooldown period)
   */
  private TicketValidationStatusEnum determineValidationStatus(Ticket ticket) {
    LocalDateTime now = LocalDateTime.now();
    Event event = ticket.getTicketType().getEvent();

    // 1. Check if ticket has been cancelled
    if (TicketStatusEnum.CANCELLED.equals(ticket.getStatus())) {
      return TicketValidationStatusEnum.INVALID;
    }

    // 2. Check if event has ended
    if (event.getEnd() != null && now.isAfter(event.getEnd())) {
      return TicketValidationStatusEnum.EXPIRED;
    }

    // 3. Check if trying to enter too early (more than 1 hour before event start)
    if (event.getStart() != null && now.isBefore(event.getStart().minusHours(1))) {
      return TicketValidationStatusEnum.INVALID;
    }

    // 4. Prevent duplicate scans within cooldown period (anti-fraud measure)
    LocalDateTime cooldownThreshold = now.minusMinutes(VALIDATION_COOLDOWN_MINUTES);
    boolean hasRecentValidation = ticket.getValidations().stream()
        .filter(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
        .anyMatch(v -> v.getCreatedAt().isAfter(cooldownThreshold));

    if (hasRecentValidation) {
      return TicketValidationStatusEnum.INVALID; // Scanned too recently
    }

    // 5. For single-entry events, check if already used
    // TODO: Add Event.allowReentry field to support configurable re-entry policies
    // For now, allow re-validation after cooldown period to support legitimate re-entry
    
    return TicketValidationStatusEnum.VALID;
  }

  @Override
  public TicketValidation validateTicketByQrCode(UUID ticketId, UUID validatedByUserId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new TicketNotFoundException());

    return validateTicket(ticket, TicketValidationMethodEnum.QR_CODE, validatedByUserId);
  }

  @Override
  public TicketValidation validateTicketManually(UUID ticketId, UUID validatedByUserId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new TicketNotFoundException());

    return validateTicket(ticket, TicketValidationMethodEnum.MANUAL, validatedByUserId);
  }

}
