package com.pdstpo.supermercado.exceptions;

public class PaymentRejectedException extends BusinessException {

    public PaymentRejectedException(String message) {
        super(message);
    }
}
