package com.pdstpo.supermercado.domain.state;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;

public interface EstadoPedido {

    void pagar(Pedido pedido);

    void enviar(Pedido pedido);

    void entregar(Pedido pedido);

    void cancelar(Pedido pedido);

    EstadoPedidoEnum getNombre();
}
