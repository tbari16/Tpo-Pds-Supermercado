package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.CategoriaResponse;
import com.pdstpo.supermercado.dto.ProductoResponse;
import com.pdstpo.supermercado.services.CatalogoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalogo")
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping("/productos")
    public List<ProductoResponse> listarProductos() {
        return catalogoService.listarProductosActivos();
    }

    @GetMapping("/productos/{id}")
    public ProductoResponse obtenerProducto(@PathVariable Long id) {
        return catalogoService.obtenerProductoPorId(id);
    }

    @GetMapping("/productos/buscar")
    public List<ProductoResponse> buscarProductos(@RequestParam String nombre) {
        return catalogoService.buscarPorNombre(nombre);
    }

    @GetMapping("/productos/categoria/{categoriaId}")
    public List<ProductoResponse> buscarProductosPorCategoria(@PathVariable Long categoriaId) {
        return catalogoService.buscarPorCategoria(categoriaId);
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> obtenerCategorias() {
        return catalogoService.obtenerCategorias();
    }
}
