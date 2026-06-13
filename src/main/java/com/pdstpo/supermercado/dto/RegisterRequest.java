package com.pdstpo.supermercado.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        @NotBlank(message = "La password es obligatoria")
        @Size(min = 6, message = "La password debe tener al menos 6 caracteres")
        String password,

        @NotBlank(message = "La direccion de envio es obligatoria")
        String direccionEnvio,

        @NotBlank(message = "El telefono es obligatorio")
        String telefono) {
}
