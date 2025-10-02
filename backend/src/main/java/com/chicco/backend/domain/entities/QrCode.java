package com.chicco.backend.domain.entities;

import java.util.Objects;
import java.util.UUID;

import com.chicco.backend.domain.enums.QrCodeStatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "qr_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QrCode extends Log {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "code", columnDefinition = "TEXT", nullable = false, unique = true)
  private String value;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private QrCodeStatusEnum status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ticket_id", nullable = false)
  private Ticket ticket;

  // only fields that identify the QR (avoid relationships)
  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    QrCode qrCode = (QrCode) o;
    return Objects.equals(id, qrCode.id) &&
        Objects.equals(value, qrCode.value) &&
        status == qrCode.status;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, value, status);
  }
}
