package com.chicco.backend.services.impl;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chicco.backend.domain.CreateEventRequest;
import com.chicco.backend.domain.UpdateEventRequest;
import com.chicco.backend.domain.UpdateTicketTypeRequest;
import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.domain.entities.TicketType;
import com.chicco.backend.domain.entities.User;
import com.chicco.backend.domain.enums.EventStatusEnum;
import com.chicco.backend.domain.enums.EventTypeEnum;
import com.chicco.backend.exceptions.EventNotFoundException;
import com.chicco.backend.exceptions.EventUpdateException;
import com.chicco.backend.exceptions.TicketTypeNotFoundException;
import com.chicco.backend.exceptions.UserNotFoundException;
import com.chicco.backend.repositories.EventRepository;
import com.chicco.backend.repositories.UserRepository;
import com.chicco.backend.services.EventService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

  private final UserRepository userRepository;
  private final EventRepository eventRepository;

  @Override
  @Transactional // To manage the cascade persist of TicketTypes
  public Event createEvent(UUID organizerId, CreateEventRequest eventRequest) {
    User organizer = userRepository.findById(organizerId)
        .orElseThrow(() -> new UserNotFoundException(
            String.format("User with id '%s' not found", organizerId)));

    Event eventToCreate = new Event();

    List<TicketType> ticketTypesToCreate = eventRequest.getTicketTypes().stream().map(
        ticketType -> {
          TicketType ticketTypeToCreate = new TicketType();
          ticketTypeToCreate.setName(ticketType.getName());
          ticketTypeToCreate.setDescription(ticketType.getDescription());
          ticketTypeToCreate.setPrice(ticketType.getPrice());
          ticketTypeToCreate.setTotalAvailable(ticketType.getTotalAvailable());
          ticketTypeToCreate.setEvent(eventToCreate);
          return ticketTypeToCreate;
        }).toList();

    eventToCreate.setName(eventRequest.getName());
    eventToCreate.setDescription(eventRequest.getDescription());
    eventToCreate.setStatus(eventRequest.getStatus());
    eventToCreate.setType(eventRequest.getType());
    eventToCreate.setStart(eventRequest.getStart());
    eventToCreate.setEnd(eventRequest.getEnd());
    eventToCreate.setSalesStart(eventRequest.getSalesStart());
    eventToCreate.setSalesEnd(eventRequest.getSalesEnd());
    eventToCreate.setVenue(eventRequest.getVenue());
    eventToCreate.setOrganizer(organizer);
    eventToCreate.setTicketTypes(ticketTypesToCreate);

    return eventRepository.save(eventToCreate);
  }

  @Override
  public Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable) {
    return eventRepository.findByOrganizerId(organizerId, pageable);
  }

  @Override
  public Optional<Event> getEventForOrganizer(UUID organizerId, UUID id) {
    return eventRepository.findByIdAndOrganizerId(id, organizerId);
  }

  @Override
  @Transactional // To manage the lazy loading of TicketTypes
  public Event updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event) {
    if (event.getId() == null) {
      throw new EventUpdateException("Event id is required");
    }
    if (!id.equals(event.getId())) {
      throw new EventUpdateException("Event id in path and body do not match");
    }

    Event existingEvent = eventRepository.findByIdAndOrganizerId(id, organizerId)
        .orElseThrow(() -> new EventNotFoundException(
            String.format("Event with id '%s' not found for organizer with id '%s'", id, organizerId)));

    existingEvent.setName(event.getName());
    existingEvent.setDescription(event.getDescription());
    existingEvent.setStatus(event.getStatus());
    existingEvent.setType(event.getType());
    existingEvent.setStart(event.getStart());
    existingEvent.setEnd(event.getEnd());
    existingEvent.setSalesStart(event.getSalesStart());
    existingEvent.setSalesEnd(event.getSalesEnd());
    existingEvent.setVenue(event.getVenue());

    Set<UUID> requestTicketTypeIds = event.getTicketTypes()
        .stream()
        .map(UpdateTicketTypeRequest::getId)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet());

    existingEvent.getTicketTypes().removeIf(
        existingTicketType -> !requestTicketTypeIds.contains(existingTicketType.getId()));

    Map<UUID, TicketType> existingTicketTypesIndex = existingEvent.getTicketTypes().stream()
        .collect(Collectors.toMap(TicketType::getId, Function.identity()));

    for (UpdateTicketTypeRequest ticketTypeRequest : event.getTicketTypes()) {
      if (ticketTypeRequest.getId() == null) {
        // Create
        TicketType newTicketType = new TicketType();
        newTicketType.setName(ticketTypeRequest.getName());
        newTicketType.setDescription(ticketTypeRequest.getDescription());
        newTicketType.setPrice(ticketTypeRequest.getPrice());
        newTicketType.setTotalAvailable(ticketTypeRequest.getTotalAvailable());
        newTicketType.setEvent(existingEvent);
        existingEvent.getTicketTypes().add(newTicketType);

      } else if (existingTicketTypesIndex.containsKey(ticketTypeRequest.getId())) {
        // Update
        TicketType existingTicketType = existingTicketTypesIndex.get(ticketTypeRequest.getId());
        existingTicketType.setName(ticketTypeRequest.getName());
        existingTicketType.setDescription(ticketTypeRequest.getDescription());
        existingTicketType.setPrice(ticketTypeRequest.getPrice());
        existingTicketType.setTotalAvailable(ticketTypeRequest.getTotalAvailable());

      } else {
        // Error
        throw new TicketTypeNotFoundException(
            String.format("TicketType with id '%s' not found in event with id '%s'",
                ticketTypeRequest.getId(), existingEvent.getId()));
      }
    }

    return eventRepository.save(existingEvent);
  }

  @Override
  public void deleteEventForOrganizer(UUID organizerId, UUID id) {
    Event existingEvent = eventRepository.findByIdAndOrganizerId(id, organizerId)
        .orElseThrow(() -> new EventNotFoundException(
            String.format("Event with id '%s' not found for organizer with id '%s'", id, organizerId)));
    eventRepository.delete(existingEvent);
  }

  @Override
  public Page<Event> listPublishedEvents(Pageable pageable) {
    return eventRepository.findByStatus(EventStatusEnum.PUBLISHED, pageable);
  }

  @Override
  public Page<Event> searchPublishedEvents(String query, EventTypeEnum type, Pageable pageable) {
    String sanitizedQuery = (query == null || query.trim().isEmpty()) ? null : query.trim();
    return eventRepository.searchEvents(sanitizedQuery, type, pageable);
  }

  @Override
  public Optional<Event> getPublishedEvent(UUID eventId) {
    return eventRepository.findByIdAndStatus(eventId, EventStatusEnum.PUBLISHED);
  }
}
