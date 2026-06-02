package com.pdstpo.supermercado.exceptions;

public class InvalidStateTransitionException extends BusinessException {

    public InvalidStateTransitionException(String message) {
        super(message);
    }
}
