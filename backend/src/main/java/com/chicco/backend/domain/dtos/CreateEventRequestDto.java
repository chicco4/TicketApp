package com.chicco.backend.domain.dtos;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.chicco.backend.domain.enums.EventStatusEnum;
import com.chicco.backend.domain.enums.EventTypeEnum;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequestDto {

  @NotBlank(message = "Event name is required")
  private String name;

  private String description;

  @NotNull(message = "Event status must be provided")
  private EventStatusEnum status;

  @NotNull(message = "Event type must be provided")
  private EventTypeEnum type;

  private LocalDateTime start;

  private LocalDateTime end;

  private LocalDateTime salesStart;

  private LocalDateTime salesEnd;

  @NotBlank(message = "Event venue is required")
  private String venue; // TODO: to replace with Venue entity later like TicketType

  @NotEmpty(message = "At least one ticket is required")
  @Valid
  private List<CreateTicketTypeRequestDto> ticketTypes = new ArrayList<>();
}
