package com.pdstpo.supermercado.exceptions;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Email o password invalidos");
    }
}
