package com.chicco.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.chicco.backend.domain.CreateEventRequest;
import com.chicco.backend.domain.dtos.UpdateEventRequestDto;
import com.chicco.backend.domain.dtos.UpdateEventResponseDto;
import com.chicco.backend.domain.CreateTicketTypeRequest;
import com.chicco.backend.domain.UpdateEventRequest;
import com.chicco.backend.domain.UpdateTicketTypeRequest;
import com.chicco.backend.domain.dtos.UpdateTicketTypeRequestDto;
import com.chicco.backend.domain.dtos.UpdateTicketTypeResponseDto;
import com.chicco.backend.domain.dtos.CreateEventRequestDto;
import com.chicco.backend.domain.dtos.CreateTicketTypeRequestDto;
import com.chicco.backend.domain.dtos.GetEventDetailsResponseDto;
import com.chicco.backend.domain.dtos.GetEventDetailsTicketTypeResponseDto;
import com.chicco.backend.domain.dtos.GetPublishedEventDetailsResponseDto;
import com.chicco.backend.domain.dtos.GetPublishedEventDetailsTicketTypeResponseDto;
import com.chicco.backend.domain.dtos.ListEventResponseDto;
import com.chicco.backend.domain.dtos.ListEventTicketTypeResponseDto;
import com.chicco.backend.domain.dtos.ListPublishedEventResponseDto;
import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.domain.entities.TicketType;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

  CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

  CreateEventRequest fromDto(CreateEventRequestDto dto);

  UpdateEventResponseDto toDto(Event event);

  ListEventTicketTypeResponseDto toDto(TicketType ticketType);

  ListEventResponseDto toListEventResponseDto(Event event);

  GetEventDetailsTicketTypeResponseDto toGetEventDetailsTicketTypesResponseDto(TicketType ticketType);

  GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

  UpdateTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);

  UpdateEventRequest fromDto(UpdateEventRequestDto dto);

  UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

  UpdateEventResponseDto toUpdateEventResponseDto(Event event);

  ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

  GetPublishedEventDetailsTicketTypeResponseDto toGetPublishedEventDetailsTicketTypeResponseDto(TicketType ticketType);

  GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);
}