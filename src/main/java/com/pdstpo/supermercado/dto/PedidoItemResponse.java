package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.PedidoItem;
import java.math.BigDecimal;

public record PedidoItemResponse(
        Long id,
        Long productoId,
        String productoNombre,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal) {

    public static PedidoItemResponse from(PedidoItem item) {
        return new PedidoItemResponse(
                item.getId(),
                item.getProducto().getId(),
                item.getProducto().getNombre(),
                item.getCantidad(),
                item.getPrecioUnitario(),
                item.getSubtotal());
    }
}
