package com.chicco.backend.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.CreateEventRequest;
import com.chicco.backend.domain.UpdateEventRequest;
import com.chicco.backend.domain.dtos.UpdateEventResponseDto;
import com.chicco.backend.domain.dtos.CreateEventRequestDto;
import com.chicco.backend.domain.dtos.GetEventDetailsResponseDto;
import com.chicco.backend.domain.dtos.ListEventResponseDto;
import com.chicco.backend.domain.dtos.UpdateEventRequestDto;
import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.mappers.EventMapper;
import com.chicco.backend.services.EventService;
import static com.chicco.backend.util.JwtUtil.parseUserId;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

  private final EventMapper eventMapper;
  private final EventService eventService;

  @PostMapping
  public ResponseEntity<UpdateEventResponseDto> createEvent(
      @AuthenticationPrincipal Jwt jwt,
      @Valid @RequestBody CreateEventRequestDto createEventRequestDto) {

    CreateEventRequest createEventRequest = eventMapper.fromCreateEventRequestDto(createEventRequestDto);
    UUID userId = parseUserId(jwt);

    Event createdEvent = eventService.createEvent(userId, createEventRequest);
    UpdateEventResponseDto createEventResponseDto = eventMapper.toUpdateEventResponseDto(createdEvent);

    return new ResponseEntity<>(createEventResponseDto, HttpStatus.CREATED);
  }

  // TODO: change so that the events shown change based on whether the user is an
  // organizer or a regular user
  // for organizers, show all events they created
  // for regular users, show only events they have tickets for
  // this will probably require a new endpoint for regular users
  // and the current one will be only for organizers
  // also, consider renaming the endpoint to /api/v1/organizer/events or similar
  // to make it clear that it's only for organizers
  // and add a new endpoint for regular users at /api/v1/events
  // that shows only events they have tickets for
  // this will require changes in the EventService and EventRepository as well
  // and possibly new DTOs and mappers
  // for now, we'll keep it as is and just add a TODO
  @GetMapping()
  public ResponseEntity<Page<ListEventResponseDto>> listEvents(
      @AuthenticationPrincipal Jwt jwt,
      Pageable pageable) {

    UUID userId = parseUserId(jwt);
    Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);

    return ResponseEntity.ok(events.map(eventMapper::toListEventResponseDto));
  }

  @GetMapping("/{event-id}")
  public ResponseEntity<GetEventDetailsResponseDto> getEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("event-id") UUID eventId) {

    UUID userId = parseUserId(jwt);
    return eventService.getEventForOrganizer(userId, eventId)
        .map(eventMapper::toGetEventDetailsResponseDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{event-id}")
  public ResponseEntity<UpdateEventResponseDto> updateEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("event-id") UUID eventId,
      @Valid @RequestBody UpdateEventRequestDto updateEventRequestDto) {

    UpdateEventRequest updateEventRequest = eventMapper.fromUpdateEventRequestDto(updateEventRequestDto);
    UUID userId = parseUserId(jwt);

    Event createdEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);
    UpdateEventResponseDto updateEventResponseDto = eventMapper.toUpdateEventResponseDto(createdEvent);

    return ResponseEntity.ok(updateEventResponseDto);
  }

  @DeleteMapping("/{event-id}")
  public ResponseEntity<Void> deleteEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable("event-id") UUID eventId) {
    UUID userId = parseUserId(jwt);
    eventService.deleteEventForOrganizer(userId, eventId);
    return ResponseEntity.noContent().build();
  }

  // TODO: add endpoint for every authenticated user to purchase tickets for an
  // event
  // this will require a new service method in EventService
  // and possibly new DTOs and mappers
  // the endpoint should be POST /api/v1/events/{event-id}/purchase
  // and it should accept a request body with the number and types of tickets to
  // purchase
  // and return a response with the details of the purchased tickets
  // for now, we'll just add a TODO

  // TODO: add endpoint to validate tickets for an event
  // this will require a new service method in EventService
  // and possibly new DTOs and mappers
  // the endpoint should be POST /api/v1/events/{event_id}/ticket-validations
  // and accept a request body with the ticket validation details
  // and return a response with the details of the ticket validation
  // for now, we'll just add a TODO

}