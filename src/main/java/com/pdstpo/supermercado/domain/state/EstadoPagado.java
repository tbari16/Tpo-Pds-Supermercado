package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.exceptions.InvalidStateTransitionException;

public class EstadoPagado implements EstadoPedido {

    @Override
    public void pagar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede pagar un pedido ya pagado");
    }

    @Override
    public void enviar(Pedido pedido) {
        pedido.cambiarEstado(new EstadoEnviado());
    }

    @Override
    public void entregar(Pedido pedido) {
        throw new InvalidStateTransitionException("No se puede entregar un pedido pagado sin enviarlo");
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.cambiarEstado(new EstadoCancelado());
    }

    @Override
    public EstadoPedidoEnum getNombre() {
        return EstadoPedidoEnum.PAGADO;
    }
}
