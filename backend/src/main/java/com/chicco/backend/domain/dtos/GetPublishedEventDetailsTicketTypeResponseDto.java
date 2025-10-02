package com.chicco.backend.domain.dtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetPublishedEventDetailsTicketTypeResponseDto {
  private UUID id;
  private String name;
  private String description;
  private Double price;
}
