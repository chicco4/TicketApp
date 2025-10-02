package com.chicco.backend.domain.entities;

import java.util.Objects;
import java.util.UUID;

import com.chicco.backend.domain.enums.VenueTypeEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venue {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "address", nullable = false)
  private String address;

  @Column(name = "capacity", nullable = false)
  private Integer capacity;

  @Column(name = "type", nullable = false)
  @Enumerated(EnumType.STRING)
  private VenueTypeEnum type;

  // TODO: add relationship with events
  // @OneToMany(mappedBy = "events", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  // private List<Event> events = new ArrayList<>();

  // identifying fields only (no relationships here anyway)
  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Venue venue = (Venue) o;
    return Objects.equals(id, venue.id) &&
        Objects.equals(name, venue.name) &&
        Objects.equals(address, venue.address) &&
        Objects.equals(capacity, venue.capacity) &&
        type == venue.type;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, address, capacity, type);
  }
}
