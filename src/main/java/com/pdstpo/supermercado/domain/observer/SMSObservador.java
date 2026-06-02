package com.pdstpo.supermercado.domain.observer;

import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.Notificacion;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.entities.TipoNotificacion;
import com.pdstpo.supermercado.repositories.NotificacionRepository;
import org.springframework.stereotype.Component;

@Component
public class SMSObservador implements ObservadorPedido {

    private final NotificacionRepository notificacionRepository;

    public SMSObservador(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public void actualizar(Pedido pedido, EstadoPedidoEnum nuevoEstado) {
        String mensaje = "SMS: tu pedido #" + pedido.getId() + " cambio al estado " + nuevoEstado;
        notificacionRepository.save(new Notificacion(pedido.getCliente(), pedido, TipoNotificacion.SMS, mensaje));
    }
}
