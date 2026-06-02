package com.pdstpo.supermercado.domain.observer;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Pedido;

public interface ObservadorPedido {

    void actualizar(Pedido pedido, EstadoPedidoEnum nuevoEstado);
}
