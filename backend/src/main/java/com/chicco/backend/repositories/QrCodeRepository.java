package com.chicco.backend.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chicco.backend.domain.entities.QrCode;
import com.chicco.backend.domain.enums.QrCodeStatusEnum;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {
  Optional<QrCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID ticketPurchaseId);

  Optional<QrCode> findByIdAndStatus(UUID id, QrCodeStatusEnum status);
}
