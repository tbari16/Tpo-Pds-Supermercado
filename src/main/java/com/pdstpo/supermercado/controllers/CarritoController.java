package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.CarritoResponse;
import com.pdstpo.supermercado.dto.ModificarCantidadRequest;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.CarritoService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public CarritoResponse verCarrito(@AuthenticationPrincipal UsuarioDetails usuario) {
        return carritoService.verCarrito(usuario.getId());
    }

    @PostMapping("/items")
    public CarritoResponse agregarProducto(
            @AuthenticationPrincipal UsuarioDetails usuario,
            @Valid @RequestBody AgregarCarritoRequest request) {
        return carritoService.agregarProducto(usuario.getId(), request);
    }

    @PutMapping("/items/{productoId}")
    public CarritoResponse modificarCantidad(
            @AuthenticationPrincipal UsuarioDetails usuario,
            @PathVariable Long productoId,
            @Valid @RequestBody ModificarCantidadRequest request) {
        return carritoService.modificarCantidad(usuario.getId(), productoId, request);
    }

    @DeleteMapping("/items/{productoId}")
    public CarritoResponse eliminarProducto(
            @AuthenticationPrincipal UsuarioDetails usuario,
            @PathVariable Long productoId) {
        return carritoService.eliminarProducto(usuario.getId(), productoId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void vaciarCarrito(@AuthenticationPrincipal UsuarioDetails usuario) {
        carritoService.vaciarCarrito(usuario.getId());
    }

    @GetMapping("/total")
    public Map<String, BigDecimal> verTotal(@AuthenticationPrincipal UsuarioDetails usuario) {
        return Map.of("total", carritoService.verTotal(usuario.getId()));
    }
}
