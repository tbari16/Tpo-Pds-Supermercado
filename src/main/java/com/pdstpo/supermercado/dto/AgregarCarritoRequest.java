package com.pdstpo.supermercado.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AgregarCarritoRequest(
        @NotNull Long productoId,
        @Min(1) int cantidad) {
}
