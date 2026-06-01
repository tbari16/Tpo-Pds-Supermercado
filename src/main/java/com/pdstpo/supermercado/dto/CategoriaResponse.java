package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.CategoriaComponente;
import com.pdstpo.supermercado.entities.CategoriaCompuesta;
import java.util.List;

public record CategoriaResponse(
        Long id,
        String nombre,
        String descripcion,
        Long categoriaPadreId,
        boolean hoja,
        int cantidadProductos,
        List<CategoriaResponse> subcategorias) {

    public static CategoriaResponse from(CategoriaComponente categoria) {
        List<CategoriaResponse> subcategorias = categoria instanceof CategoriaCompuesta compuesta
                ? compuesta.getSubcategorias().stream()
                        .map(CategoriaResponse::from)
                        .toList()
                : List.of();

        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.getPadre() != null ? categoria.getPadre().getId() : null,
                categoria.esHoja(),
                categoria.calcularCantidadProductos(),
                subcategorias);
    }
}
