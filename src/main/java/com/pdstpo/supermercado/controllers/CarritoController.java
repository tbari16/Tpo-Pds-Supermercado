package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.CarritoResponse;
import com.pdstpo.supermercado.dto.ModificarCantidadRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public CarritoResponse verCarrito(@RequestParam Long clienteId) {
        return carritoService.verCarrito(clienteId);
    }

    @PostMapping("/items")
    public CarritoResponse agregarProducto(
            @RequestParam Long clienteId,
            @Valid @RequestBody AgregarCarritoRequest request) {
        return carritoService.agregarProducto(clienteId, request);
    }

    @PutMapping("/items/{productoId}")
    public CarritoResponse modificarCantidad(
            @RequestParam Long clienteId,
            @PathVariable Long productoId,
            @Valid @RequestBody ModificarCantidadRequest request) {
        return carritoService.modificarCantidad(clienteId, productoId, request);
    }

    @DeleteMapping("/items/{productoId}")
    public CarritoResponse eliminarProducto(
            @RequestParam Long clienteId,
            @PathVariable Long productoId) {
        return carritoService.eliminarProducto(clienteId, productoId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void vaciarCarrito(@RequestParam Long clienteId) {
        carritoService.vaciarCarrito(clienteId);
    }

    @GetMapping("/total")
    public Map<String, BigDecimal> verTotal(@RequestParam Long clienteId) {
        return Map.of("total", carritoService.verTotal(clienteId));
    }
}
