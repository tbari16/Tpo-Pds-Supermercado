package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import jakarta.validation.constraints.NotNull;

public record ActualizarEstadoPedidoRequest(
        @NotNull EstadoPedidoEnum nuevoEstado) {
}
