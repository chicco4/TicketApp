package com.chicco.backend.domain.dtos;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.chicco.backend.domain.enums.EventTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetPublishedEventDetailsResponseDto {
  private UUID id;
  private String name;
  private EventTypeEnum type;
  private LocalDateTime start;
  private LocalDateTime end;
  private String venue; // TODO: to replace with Venue entity later like TicketType
  private List<GetPublishedEventDetailsTicketTypeResponseDto> ticketTypes = new ArrayList<>();
}
