package com.pdstpo.supermercado.dto;

import jakarta.validation.constraints.NotBlank;

public record PerfilUsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @NotBlank(message = "La direccion de envio es obligatoria")
        String direccionEnvio,

        @NotBlank(message = "El telefono es obligatorio")
        String telefono) {
}
