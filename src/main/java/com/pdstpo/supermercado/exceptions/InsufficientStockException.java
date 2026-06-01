package com.pdstpo.supermercado.exceptions;

public class InsufficientStockException extends BusinessException {

    public InsufficientStockException(String message) {
        super(message);
    }
}
