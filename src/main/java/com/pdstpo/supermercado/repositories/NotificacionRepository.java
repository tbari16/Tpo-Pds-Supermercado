package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.Notificacion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuarioIdOrderByFechaEnvioDesc(Long usuarioId);
}
