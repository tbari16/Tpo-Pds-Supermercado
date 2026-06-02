package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.Carrito;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByClienteId(Long clienteId);
}
