package com.chicco.backend.exceptions;

public class TicketSoldOutException extends EventTicketException {

  public TicketSoldOutException() {
  }

  public TicketSoldOutException(String message) {
    super(message);
  }

  public TicketSoldOutException(String message, Throwable cause) {
    super(message, cause);
  }

  public TicketSoldOutException(Throwable cause) {
    super(cause);
  }

  protected TicketSoldOutException(String message, Throwable cause, boolean enableSuppression,
      boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

}
