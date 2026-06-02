package com.pdstpo.supermercado.domain.payment;

import java.time.LocalDateTime;

public class ResultadoPago {

    private final boolean exitoso;
    private final String referenciaPago;
    private final String mensaje;
    private final LocalDateTime fechaProcesamiento;

    public ResultadoPago(boolean exitoso, String referenciaPago, String mensaje, LocalDateTime fechaProcesamiento) {
        this.exitoso = exitoso;
        this.referenciaPago = referenciaPago;
        this.mensaje = mensaje;
        this.fechaProcesamiento = fechaProcesamiento;
    }

    public static ResultadoPago aprobado(String referenciaPago, String mensaje) {
        return new ResultadoPago(true, referenciaPago, mensaje, LocalDateTime.now());
    }

    public static ResultadoPago rechazado(String referenciaPago, String mensaje) {
        return new ResultadoPago(false, referenciaPago, mensaje, LocalDateTime.now());
    }

    public boolean isExitoso() {
        return exitoso;
    }

    public String getReferenciaPago() {
        return referenciaPago;
    }

    public String getMensaje() {
        return mensaje;
    }

    public LocalDateTime getFechaProcesamiento() {
        return fechaProcesamiento;
    }
}
