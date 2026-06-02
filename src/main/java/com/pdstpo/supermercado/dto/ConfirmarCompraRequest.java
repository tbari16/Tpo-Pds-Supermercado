package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConfirmarCompraRequest(
        @NotNull MetodoPagoEnum metodoPago,
        @NotBlank String direccionEnvio) {
}
