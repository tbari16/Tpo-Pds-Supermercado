package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.entities.RolUsuario;
import com.pdstpo.supermercado.exceptions.ForbiddenOperationException;
import com.pdstpo.supermercado.exceptions.ResourceNotFoundException;
import com.pdstpo.supermercado.repositories.PedidoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> obtenerPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId).stream()
                .peek(Pedido::reconstruirEstadoActual)
                .map(PedidoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtenerPedidoPorId(Long pedidoId) {
        Pedido pedido = obtenerPedido(pedidoId);
        return PedidoResponse.from(pedido);
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtenerPedidoParaUsuario(Long pedidoId, Long usuarioId, RolUsuario rol) {
        Pedido pedido = obtenerPedido(pedidoId);
        if (RolUsuario.CLIENTE.equals(rol) && !pedido.getCliente().getId().equals(usuarioId)) {
            throw new ForbiddenOperationException("No podes consultar pedidos de otro cliente");
        }
        return PedidoResponse.from(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAll().stream()
                .peek(Pedido::reconstruirEstadoActual)
                .map(PedidoResponse::from)
                .toList();
    }

    private Pedido obtenerPedido(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        pedido.reconstruirEstadoActual();
        return pedido;
    }
}
