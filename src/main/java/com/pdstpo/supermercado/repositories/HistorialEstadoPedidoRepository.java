package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.HistorialEstadoPedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialEstadoPedidoRepository extends JpaRepository<HistorialEstadoPedido, Long> {

    List<HistorialEstadoPedido> findByPedidoIdOrderByFechaCambioAsc(Long pedidoId);
}
