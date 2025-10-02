package com.chicco.backend.domain.dtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListTicketTicketTypeResponseDto {
  private UUID id;
  private String name;
  private Double price;

}
