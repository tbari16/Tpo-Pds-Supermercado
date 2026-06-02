package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.exceptions.InvalidStateTransitionException;

public class EstadoPendiente implements EstadoPedido {

    @Override
    public void pagar(Pedido pedido) {
        pedido.cambiarEstado(new EstadoPagado());
    }

    @Override
    public void enviar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede enviar un pedido pendiente");
    }

    @Override
    public void entregar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede entregar un pedido pendiente");
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.cambiarEstado(new EstadoCancelado());
    }

    @Override
    public EstadoPedidoEnum getNombre() {
        return EstadoPedidoEnum.PENDIENTE;
    }
}
