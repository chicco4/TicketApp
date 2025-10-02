package com.chicco.backend.domain.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends Log {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  // @GeneratedValue(strategy = GenerationType.UUID)
  // i use keycloak for id generation
  private UUID id;

  @Column(name = "username", nullable = false, unique = true)
  private String username;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Event> organizedEvents = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "user_attending_events", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "event_id"))
  private List<Event> attendingEvents = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "user_staffing_events", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "event_id"))
  private List<Event> staffingEvents = new ArrayList<>();

  @OneToMany(mappedBy = "purchaser", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Ticket> purchasedTickets = new ArrayList<>();

  @OneToMany(mappedBy = "validatedBy", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TicketValidation> validations = new ArrayList<>();

  // identifying fields only (avoid relationships and mutable password)
  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    User user = (User) o;
    return Objects.equals(id, user.id) &&
        Objects.equals(username, user.username) &&
        Objects.equals(email, user.email);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, email);
  }
}
