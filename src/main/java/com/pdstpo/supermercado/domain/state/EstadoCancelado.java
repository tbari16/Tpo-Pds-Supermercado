package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.exceptions.InvalidStateTransitionException;

public class EstadoCancelado implements EstadoPedido {

    @Override
    public void pagar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede pagar un pedido cancelado");
    }

    @Override
    public void enviar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede enviar un pedido cancelado");
    }

    @Override
    public void entregar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede entregar un pedido cancelado");
    }

    @Override
    public void cancelar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede cancelar un pedido ya cancelado");
    }

    @Override
    public EstadoPedidoEnum getNombre() {
        return EstadoPedidoEnum.CANCELADO;
    }
}
