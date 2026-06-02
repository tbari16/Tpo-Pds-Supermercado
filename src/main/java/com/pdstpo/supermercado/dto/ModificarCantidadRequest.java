package com.pdstpo.supermercado.dto;

import jakarta.validation.constraints.Min;

public record ModificarCantidadRequest(
        @Min(0) int cantidad) {
}
