package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.ActualizarEstadoPedidoRequest;
import com.pdstpo.supermercado.dto.CategoriaRequest;
import com.pdstpo.supermercado.dto.CategoriaResponse;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.dto.ProductoRequest;
import com.pdstpo.supermercado.dto.ProductoResponse;
import com.pdstpo.supermercado.dto.StockRequest;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/productos")
    public List<ProductoResponse> listarProductos() {
        return adminService.listarProductos();
    }

    @PostMapping("/productos")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse crearProducto(@Valid @RequestBody ProductoRequest request) {
        return adminService.altaProducto(request);
    }

    @PutMapping("/productos/{productoId}")
    public ProductoResponse modificarProducto(
            @PathVariable Long productoId,
            @Valid @RequestBody ProductoRequest request) {
        return adminService.modificarProducto(productoId, request);
    }

    @DeleteMapping("/productos/{productoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void bajaProducto(@PathVariable Long productoId) {
        adminService.bajaProducto(productoId);
    }

    @PutMapping("/productos/{productoId}/stock")
    public ProductoResponse gestionarStock(
            @PathVariable Long productoId,
            @Valid @RequestBody StockRequest request) {
        return adminService.gestionarStock(productoId, request);
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> listarCategorias() {
        return adminService.listarCategorias();
    }

    @PostMapping("/categorias")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse crearCategoria(@Valid @RequestBody CategoriaRequest request) {
        return adminService.crearCategoria(request);
    }

    @PutMapping("/categorias/{categoriaId}")
    public CategoriaResponse actualizarCategoria(
            @PathVariable Long categoriaId,
            @Valid @RequestBody CategoriaRequest request) {
        return adminService.actualizarCategoria(categoriaId, request);
    }

    @DeleteMapping("/categorias/{categoriaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCategoria(@PathVariable Long categoriaId) {
        adminService.eliminarCategoria(categoriaId);
    }

    @GetMapping("/pedidos")
    public List<PedidoResponse> listarPedidos() {
        return adminService.listarPedidos();
    }

    @PutMapping("/pedidos/{pedidoId}/estado")
    public PedidoResponse actualizarEstadoPedido(
            @PathVariable Long pedidoId,
            @AuthenticationPrincipal UsuarioDetails usuario,
            @Valid @RequestBody ActualizarEstadoPedidoRequest request) {
        return adminService.actualizarEstadoPedido(pedidoId, request, usuario.getId());
    }
}
