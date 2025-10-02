package com.chicco.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketTypeRequest {
  private String name;
  private String description;
  private Double price;
  private Integer totalAvailable;
}
