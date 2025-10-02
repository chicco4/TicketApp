package com.chicco.backend.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketTypeRequestDto {

  @NotBlank(message = "TicketType name is required")
  private String name;

  private String description;

  @NotNull(message = "TicketType price is required")
  @PositiveOrZero(message = "TicketType price must be zero or greater")
  private Double price;

  private Integer totalAvailable;
}
