package com.chicco.backend.domain.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import com.chicco.backend.domain.enums.TicketStatusEnum;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket extends Log {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private TicketStatusEnum status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ticket_type_id", nullable = false)
  private TicketType ticketType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "purchaser_id", nullable = false)
  private User purchaser;

  @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TicketValidation> validations = new ArrayList<>();

  // Base64 PNG representation of the ticket QR code. Generated on-demand.
  @Column(name = "qr_value", columnDefinition = "text", unique = true)
  private String qrValue;

  // only identifying fields, ignore relationships
  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Ticket ticket = (Ticket) o;
    return Objects.equals(id, ticket.id) &&
        status == ticket.status;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, status);
  }
}
