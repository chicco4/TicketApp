package com.chicco.backend.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chicco.backend.domain.dtos.GetPublishedEventDetailsResponseDto;
import com.chicco.backend.domain.dtos.ListPublishedEventResponseDto;
import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.mappers.EventMapper;
import com.chicco.backend.services.EventService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

  private final EventService eventService;
  private final EventMapper eventMapper;

  @GetMapping()
  public ResponseEntity<Page<ListPublishedEventResponseDto>> listPublishedEvents(
      @RequestParam(required = false) String query,
      Pageable pageable) {

    Page<Event> events;
    if (null != query && !query.trim().isEmpty()) {
      events = eventService.searchPublishedEvents(query, pageable);
    } else {
      events = eventService.listPublishedEvents(pageable);
    }

    return ResponseEntity.ok(events.map(eventMapper::toListPublishedEventResponseDto));
  }

  @GetMapping("/{event-id}")
  public ResponseEntity<GetPublishedEventDetailsResponseDto> getPublishedEventDetails(
      @PathVariable("event-id") UUID eventId) {
    return eventService.getPublishedEvent(eventId)
        .map(eventMapper::toGetPublishedEventDetailsResponseDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
}
