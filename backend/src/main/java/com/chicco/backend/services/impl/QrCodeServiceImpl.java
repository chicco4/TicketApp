package com.chicco.backend.services.impl;

import java.util.Base64;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;

import com.chicco.backend.domain.entities.QrCode;
import com.chicco.backend.domain.entities.Ticket;
import com.chicco.backend.domain.enums.QrCodeStatusEnum;
import com.chicco.backend.exceptions.QrCodeGenerationException;
import com.chicco.backend.exceptions.QrCodeNotFoundException;
import com.chicco.backend.repositories.QrCodeRepository;
import com.chicco.backend.services.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j // Lombok annotation to generate a logger
public class QrCodeServiceImpl implements QrCodeService {

  private static final int QR_CODE_WIDTH = 300;
  private static final int QR_CODE_HEIGHT = 300;

  private final QrCodeRepository qrCodeRepository;
  private final QRCodeWriter qrCodeWriter;

  @Override
  public QrCode generateQrCode(Ticket ticket) {

    try {

      UUID uniqueId = UUID.randomUUID();
      String qrCodeImage = generateQrCodeImage(uniqueId);

      QrCode qrCode = new QrCode();
      qrCode.setId(uniqueId);
      qrCode.setStatus(QrCodeStatusEnum.ACTIVE);
      qrCode.setValue(qrCodeImage);
      qrCode.setTicket(ticket);
      return qrCodeRepository.saveAndFlush(qrCode);

    } catch (WriterException e) {
      throw new QrCodeGenerationException("Failed to generate QR code", e);
    }
  }

  private String generateQrCodeImage(UUID uniqueId) throws WriterException {
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
    } catch (IOException e) {
      throw new QrCodeGenerationException("Failed to generate QR code image", e);
    }

  }

  @Override
  public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
    QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaserId(ticketId, userId)
        .orElseThrow(QrCodeNotFoundException::new);

    try {
      return Base64.getDecoder().decode(qrCode.getValue());

    } catch (Exception e) {
      log.error("Invalid base64 QR code for ticketId: {}", ticketId, e);
      throw new QrCodeNotFoundException();
    }
  }

}
