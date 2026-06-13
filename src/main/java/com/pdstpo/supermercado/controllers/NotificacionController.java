package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.NotificacionResponse;
import com.pdstpo.supermercado.security.UsuarioDetails;
import com.pdstpo.supermercado.services.NotificacionService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public List<NotificacionResponse> listarNotificaciones(@AuthenticationPrincipal UsuarioDetails usuario) {
        return notificacionService.listarPorUsuario(usuario.getId());
    }
}
