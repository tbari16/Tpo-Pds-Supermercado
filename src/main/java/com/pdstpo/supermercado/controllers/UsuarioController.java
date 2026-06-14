package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.PerfilUsuarioRequest;
import com.pdstpo.supermercado.dto.PerfilUsuarioResponse;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    public PerfilUsuarioResponse verPerfil(@AuthenticationPrincipal UsuarioDetails usuario) {
        return usuarioService.verPerfil(usuario.getId());
    }

    @PutMapping("/perfil")
    public PerfilUsuarioResponse editarPerfil(
            @AuthenticationPrincipal UsuarioDetails usuario,
            @Valid @RequestBody PerfilUsuarioRequest request) {
        return usuarioService.editarPerfil(usuario.getId(), request);
    }
}
