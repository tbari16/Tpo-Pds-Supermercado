package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.domain.observer.ObservadorPedido;
import com.pdstpo.supermercado.dto.NotificacionResponse;
import com.pdstpo.supermercado.entities.Notificacion;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.repositories.NotificacionRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificacionService {

    private final List<ObservadorPedido> observadores;
    private final NotificacionRepository notificacionRepository;

    public NotificacionService(List<ObservadorPedido> observadores, NotificacionRepository notificacionRepository) {
        this.observadores = observadores;
        this.notificacionRepository = notificacionRepository;
    }

    public void registrarObservadores(Pedido pedido) {
        observadores.forEach(pedido::agregarObservador);
    }

    public void persistirNotificacion(Notificacion notificacion) {
        notificacionRepository.save(notificacion);
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId).stream()
                .map(NotificacionResponse::from)
                .toList();
    }
}
