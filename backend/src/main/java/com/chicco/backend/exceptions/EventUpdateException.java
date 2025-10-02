package com.chicco.backend.exceptions;

public class EventUpdateException extends EventTicketException {

  public EventUpdateException() {
  }

  public EventUpdateException(String message) {
    super(message);
  }

  public EventUpdateException(String message, Throwable cause) {
    super(message, cause);
  }

  public EventUpdateException(Throwable cause) {
    super(cause);
  }

  protected EventUpdateException(String message, Throwable cause, boolean enableSuppression,
      boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

}
