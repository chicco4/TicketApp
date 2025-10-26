package com.chicco.backend.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chicco.backend.domain.entities.Event;
import com.chicco.backend.domain.enums.EventStatusEnum;
import com.chicco.backend.domain.enums.EventTypeEnum;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
  Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

  Optional<Event> findByIdAndOrganizerId(UUID eventId, UUID organizerId);

  Page<Event> findByStatus(EventStatusEnum status, Pageable pageable);

  @Query("SELECT e FROM Event e WHERE" +
      " e.status = com.chicco.backend.domain.enums.EventStatusEnum.PUBLISHED" +
      " AND (" +
      " :query IS NULL OR :query = ''" +
      " OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%'))" +
      " OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))" +
      " OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%'))" +
      ")" +
      " AND (:type IS NULL OR e.type = :type)")
  Page<Event> searchEvents(
      @Param("query") String query,
      @Param("type") EventTypeEnum type,
      Pageable pageable);

  Optional<Event> findByIdAndStatus(UUID eventId, EventStatusEnum status);
}
