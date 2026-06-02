package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.Carrito;
import java.math.BigDecimal;
import java.util.List;

public record CarritoResponse(
        Long id,
        Long clienteId,
        List<CarritoItemResponse> items,
        BigDecimal total) {

    public static CarritoResponse from(Carrito carrito) {
        return new CarritoResponse(
                carrito.getId(),
                carrito.getCliente().getId(),
                carrito.getItems().stream()
                        .map(CarritoItemResponse::from)
                        .toList(),
                carrito.calcularTotal());
    }
}
