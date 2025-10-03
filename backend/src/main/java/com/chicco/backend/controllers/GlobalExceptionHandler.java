package com.chicco.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.chicco.backend.domain.dtos.ErrorDto;
import com.chicco.backend.exceptions.TicketSoldOutException;
import com.chicco.backend.exceptions.TicketNotFoundException;
import com.chicco.backend.exceptions.EventNotFoundException;
import com.chicco.backend.exceptions.EventUpdateException;
import com.chicco.backend.exceptions.QrCodeGenerationException;
import com.chicco.backend.exceptions.QrCodeNotFoundException;
import com.chicco.backend.exceptions.TicketTypeNotFoundException;
import com.chicco.backend.exceptions.InvalidJwtSubjectException;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(TicketNotFoundException.class)
  public ResponseEntity<ErrorDto> handleTicketNotFoundException(TicketNotFoundException ex) {
    log.error("Caught TicketNotFoundException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Unable to find ticket");

    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(TicketSoldOutException.class)
  public ResponseEntity<ErrorDto> handleTicketSoldOutException(TicketSoldOutException ex) {
    log.error("Caught TicketSoldOutException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Ticket is sold out");

    return new ResponseEntity<>(errorDto, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(QrCodeNotFoundException.class)
  public ResponseEntity<ErrorDto> handleQrCodeNotFoundException(QrCodeNotFoundException ex) {
    log.error("Caught QrCodeNotFoundException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Unable to find QR code");

    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(QrCodeGenerationException.class)
  public ResponseEntity<ErrorDto> handleQrCodeGenerationException(QrCodeGenerationException ex) {
    log.error("Caught QrCodeGenerationException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Unable to generate QR code");

    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(TicketTypeNotFoundException.class)
  public ResponseEntity<ErrorDto> handleTicketTypeNotFoundException(TicketTypeNotFoundException ex) {
    log.error("Caught TicketTypeNotFoundException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Ticket type not found");

    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EventNotFoundException.class)
  public ResponseEntity<ErrorDto> handleEventNotFoundException(EventNotFoundException ex) {
    log.error("Caught EventNotFoundException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Event not found");

    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EventUpdateException.class)
  public ResponseEntity<ErrorDto> handleEventUpdateException(EventUpdateException ex) {
    log.error("Caught EventUpdateException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Event update failed");

    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException ex) {
    log.error("Caught MethodArgumentNotValidException", ex);
    ErrorDto errorDto = new ErrorDto();

    BindingResult bindingResult = ex.getBindingResult();
    String errorMessage = bindingResult.getFieldErrors().stream().findFirst()
        .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
        .orElse("Validation error occurred");

    errorDto.setError(errorMessage);

    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorDto> handleConstraintViolation(
      ConstraintViolationException ex) {
    log.error("Caught ConstraintViolationException", ex);
    ErrorDto errorDto = new ErrorDto();

    String errorMessage = ex.getConstraintViolations().stream().findFirst()
        .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
        .orElse("Constraint violation occurred");

    errorDto.setError(errorMessage);

    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDto> handleException(Exception ex) {
    log.error("Caught exception", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("An unknown error occured");

    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(InvalidJwtSubjectException.class)
  public ResponseEntity<ErrorDto> handleInvalidJwtSubject(InvalidJwtSubjectException ex) {
    log.error("Caught InvalidJwtSubjectException", ex);
    ErrorDto errorDto = new ErrorDto();

    errorDto.setError("Invalid authentication token subject");

    return new ResponseEntity<>(errorDto, HttpStatus.UNAUTHORIZED);
  }
}