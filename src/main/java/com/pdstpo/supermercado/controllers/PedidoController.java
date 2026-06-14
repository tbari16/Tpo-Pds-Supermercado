package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.PedidoService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/mis-pedidos")
    public List<PedidoResponse> obtenerMisPedidos(@AuthenticationPrincipal UsuarioDetails usuario) {
        return pedidoService.obtenerPedidosPorCliente(usuario.getId());
    }

    @GetMapping("/{pedidoId}")
    public PedidoResponse obtenerPedido(
            @PathVariable Long pedidoId,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        return pedidoService.obtenerPedidoParaUsuario(pedidoId, usuario.getId(), usuario.getRol());
    }
}
