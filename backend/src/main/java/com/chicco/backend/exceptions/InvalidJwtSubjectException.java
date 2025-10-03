package com.chicco.backend.exceptions;

public class InvalidJwtSubjectException extends RuntimeException {

  public InvalidJwtSubjectException(String message) {
    super(message);
  }

  public InvalidJwtSubjectException(String message, Throwable cause) {
    super(message, cause);
  }
}
