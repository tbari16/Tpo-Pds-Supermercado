package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.UnidadMedida;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank String nombre,
        @NotBlank String descripcion,
        @NotNull @DecimalMin(value = "0.01") BigDecimal precio,
        @Min(0) int stock,
        @NotNull UnidadMedida unidad,
        String imagenUrl,
        @NotNull Long categoriaId) {
}
