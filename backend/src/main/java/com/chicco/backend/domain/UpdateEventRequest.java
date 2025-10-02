package com.chicco.backend.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.chicco.backend.domain.enums.EventStatusEnum;
import com.chicco.backend.domain.enums.EventTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEventRequest {
  private UUID id;
  private String name;
  private String description;
  private EventStatusEnum status;
  private EventTypeEnum type;
  private LocalDateTime start;
  private LocalDateTime end;
  private LocalDateTime salesStart;
  private LocalDateTime salesEnd;
  private String venue;
  private List<UpdateTicketTypeRequest> ticketTypes = new ArrayList<>();
}
