package com.chicco.backend.services.impl;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.exceptions.QrCodeGenerationException;
import com.chicco.backend.exceptions.TicketNotFoundException;
import com.chicco.backend.repositories.TicketRepository;
import com.chicco.backend.services.TicketService;

import lombok.RequiredArgsConstructor;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

  private final TicketRepository ticketRepository;
  private final QRCodeWriter qrCodeWriter;

  private static final int QR_CODE_WIDTH = 300;
  private static final int QR_CODE_HEIGHT = 300;

  @Override
  public Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable) {
    return ticketRepository.findByPurchaserId(userId, pageable);
  }

  @Override
  public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId) {
    return ticketRepository.findByIdAndPurchaserId(ticketId, userId);
  }

  @Override
  public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
    Ticket ticket = ticketRepository.findByIdAndPurchaserId(ticketId, userId)
        .orElseThrow(() -> new TicketNotFoundException("Ticket not found or not owned by user"));

    // If not yet generated, generate and persist
    if (ticket.getQrValue() == null || ticket.getQrValue().isBlank()) {
      String base64 = generateQrCodeBase64(ticket.getId());
      ticket.setQrValue(base64);
      ticketRepository.saveAndFlush(ticket);
    }

    try {
      return Base64.getDecoder().decode(ticket.getQrValue());
    } catch (Exception e) {
      throw new QrCodeGenerationException("Stored QR value is invalid", e);
    }
  }

  private String generateQrCodeBase64(UUID uniqueId) {
    try {
      BitMatrix bitMatrix = qrCodeWriter.encode(
          uniqueId.toString(),
          BarcodeFormat.QR_CODE,
          QR_CODE_WIDTH,
          QR_CODE_HEIGHT);

      BufferedImage qrCodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
      try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
        ImageIO.write(qrCodeImage, "PNG", baos);
        byte[] imageBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageBytes);
      }
    } catch (WriterException | IOException e) {
      throw new QrCodeGenerationException("Failed to generate QR code", e);
    }
  }

}
