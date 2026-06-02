package com.pdstpo.supermercado.dto;

import com.pdstpo.supermercado.entities.Notificacion;
import com.pdstpo.supermercado.entities.TipoNotificacion;
import java.time.LocalDateTime;

public record NotificacionResponse(
        Long id,
        Long pedidoId,
        TipoNotificacion tipo,
        String mensaje,
        boolean enviada,
        LocalDateTime fechaEnvio) {

    public static NotificacionResponse from(Notificacion notificacion) {
        return new NotificacionResponse(
                notificacion.getId(),
                notificacion.getPedido().getId(),
                notificacion.getTipo(),
                notificacion.getMensaje(),
                notificacion.isEnviada(),
                notificacion.getFechaEnvio());
    }
}
