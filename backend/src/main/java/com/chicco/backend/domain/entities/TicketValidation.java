package com.chicco.backend.domain.entities;

import java.util.Objects;
import java.util.UUID;

import com.chicco.backend.domain.enums.TicketValidationMethodEnum;
import com.chicco.backend.domain.enums.TicketValidationStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ticket_validations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketValidation extends Log {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "method", nullable = false)
  @Enumerated(EnumType.STRING)
  private TicketValidationMethodEnum method;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private TicketValidationStatusEnum status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ticket_id", nullable = false)
  private Ticket ticket;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "validated_by", nullable = false)
  private User validatedBy;

  // identifying fields only, ignore relationships
  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    TicketValidation that = (TicketValidation) o;
    return Objects.equals(id, that.id) &&
        method == that.method &&
        status == that.status;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, method, status);
  }
}
