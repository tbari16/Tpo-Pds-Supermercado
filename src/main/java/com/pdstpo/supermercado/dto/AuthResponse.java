package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.RolUsuario;
import com.pdstpo.supermercado.entities.Usuario;

public record AuthResponse(
        String token,
        UsuarioInfo usuario) {

    public static AuthResponse from(String token, Usuario usuario) {
        return new AuthResponse(
                token,
                new UsuarioInfo(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getApellido(),
                        usuario.getEmail(),
                        usuario.getRol()));
    }

    public record UsuarioInfo(
            Long id,
            String nombre,
            String apellido,
            String email,
            RolUsuario rol) {
    }
}
