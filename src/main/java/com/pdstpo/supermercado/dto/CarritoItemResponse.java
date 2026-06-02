package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.CarritoItem;
import java.math.BigDecimal;

public record CarritoItemResponse(
        Long id,
        Long productoId,
        String productoNombre,
        String imagenUrl,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal) {

    public static CarritoItemResponse from(CarritoItem item) {
        return new CarritoItemResponse(
                item.getId(),
                item.getProducto().getId(),
                item.getProducto().getNombre(),
                item.getProducto().getImagenUrl(),
                item.getCantidad(),
                item.getPrecioUnitario(),
                item.calcularSubtotal());
    }
}
