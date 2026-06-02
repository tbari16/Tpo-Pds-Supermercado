package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;

public final class EstadoFactory {

    private EstadoFactory() {
    }

    public static EstadoPedido from(EstadoPedidoEnum estado) {
        return switch (estado) {
            case PENDIENTE -> new EstadoPendiente();
            case PAGADO -> new EstadoPagado();
            case ENVIADO -> new EstadoEnviado();
            case ENTREGADO -> new EstadoEntregado();
            case CANCELADO -> new EstadoCancelado();
        };
    }
}
