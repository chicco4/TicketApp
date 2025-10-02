package com.chicco.backend.domain.dtos;

import java.util.UUID;

import com.chicco.backend.domain.enums.TicketValidationMethodEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketValidationRequestDto {
  private UUID id;
  private TicketValidationMethodEnum method;
}
