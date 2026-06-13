package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.ConfirmarCompraRequest;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.CheckoutFacade;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutFacade checkoutFacade;

    public CheckoutController(CheckoutFacade checkoutFacade) {
        this.checkoutFacade = checkoutFacade;
    }

    @PostMapping("/confirmar")
    public PedidoResponse confirmarCompra(
            @AuthenticationPrincipal UsuarioDetails usuario,
            @Valid @RequestBody ConfirmarCompraRequest request) {
        return checkoutFacade.confirmarCompra(usuario.getId(), request);
    }
}
