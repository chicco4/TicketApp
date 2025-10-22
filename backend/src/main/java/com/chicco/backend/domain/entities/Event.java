package com.chicco.backend.domain.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import com.chicco.backend.domain.enums.EventStatusEnum;
import com.chicco.backend.domain.enums.EventTypeEnum;

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
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Event extends Log {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "description")
  private String description;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private EventStatusEnum status;

  @Column(name = "type", nullable = false)
  @Enumerated(EnumType.STRING)
  private EventTypeEnum type;

  @Column(name = "event_start", nullable = false)
  private LocalDateTime start;

  @Column(name = "event_end", nullable = false)
  private LocalDateTime end;

  @Column(name = "sales_start")
  private LocalDateTime salesStart;

  @Column(name = "sales_end")
  private LocalDateTime salesEnd;

  // to use if i plan to use the Venue entity
  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "venue_id", nullable = false)
  // private Venue venue;

  @Column(name = "venue")
  private String venue;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id", nullable = false)
  private User organizer;

  @ManyToMany(mappedBy = "attendingEvents", fetch = FetchType.LAZY)
  private List<User> attendees = new ArrayList<>();

  @ManyToMany(mappedBy = "staffingEvents", fetch = FetchType.LAZY)
  private List<User> staff = new ArrayList<>();

  @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TicketType> ticketTypes = new ArrayList<>();

  // for now i use only fields that identify the event without considering
  // relationships for equals and hashcode
  // this is to avoid potential infinite loops and performance issues

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Event event = (Event) o;
    return Objects.equals(id, event.id) &&
        Objects.equals(name, event.name) &&
        Objects.equals(description, event.description) &&
        type == event.type &&
        status == event.status &&
        Objects.equals(start, event.start) &&
        Objects.equals(end, event.end) &&
        Objects.equals(salesStart, event.salesStart) &&
        Objects.equals(salesEnd, event.salesEnd);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, type, status, start, end, salesStart, salesEnd);
  }
}
