package com.pdstpo.supermercado.controllers;

import com.pdstpo.supermercado.dto.NotificacionResponse;
import com.pdstpo.supermercado.services.NotificacionService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public List<NotificacionResponse> listarNotificaciones(@RequestParam Long clienteId) {
        return notificacionService.listarPorUsuario(clienteId);
    }
}
