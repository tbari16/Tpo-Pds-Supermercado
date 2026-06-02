package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.exceptions.InvalidStateTransitionException;

public class EstadoEnviado implements EstadoPedido {

    @Override
    public void pagar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede pagar un pedido enviado");
    }

    @Override
    public void enviar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede enviar un pedido ya enviado");
    }

    @Override
    public void entregar(Pedido pedido) {
        pedido.cambiarEstado(new EstadoEntregado());
    }

    @Override
    public void cancelar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede cancelar un pedido enviado");
    }

    @Override
    public EstadoPedidoEnum getNombre() {
        return EstadoPedidoEnum.ENVIADO;
    }
}
