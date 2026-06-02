package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        Long clienteId,
        String clienteNombre,
        LocalDateTime fechaPedido,
        EstadoPedidoEnum estado,
        BigDecimal total,
        MetodoPagoEnum metodoPago,
        String referenciaPago,
        String direccionEnvio,
        List<PedidoItemResponse> items) {

    public static PedidoResponse from(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNombreCompleto(),
                pedido.getFechaPedido(),
                pedido.getEstadoEnum(),
                pedido.getTotal(),
                pedido.getMetodoPago(),
                pedido.getReferenciaPago(),
                pedido.getDireccionEnvio(),
                pedido.getItems().stream()
                        .map(PedidoItemResponse::from)
                        .toList());
    }
}
