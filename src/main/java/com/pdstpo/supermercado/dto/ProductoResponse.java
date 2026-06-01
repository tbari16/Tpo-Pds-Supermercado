package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.CategoriaComponente;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.entities.UnidadMedida;
import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        int stock,
        UnidadMedida unidad,
        String imagenUrl,
        boolean activo,
        Long categoriaId,
        String categoriaNombre) {

    public static ProductoResponse from(Producto producto) {
        CategoriaComponente categoria = producto.getCategoria();
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getUnidad(),
                producto.getImagenUrl(),
                producto.isActivo(),
                categoria != null ? categoria.getId() : null,
                categoria != null ? categoria.getNombre() : null);
    }
}
