package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.RolUsuario;

public record PerfilUsuarioResponse(
        Long id,
        String nombre,
        String apellido,
        String email,
        RolUsuario rol,
        String direccionEnvio,
        String telefono) {

    public static PerfilUsuarioResponse from(Cliente cliente) {
        return new PerfilUsuarioResponse(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getEmail(),
                cliente.getRol(),
                cliente.getDireccionEnvio(),
                cliente.getTelefono());
    }
}
