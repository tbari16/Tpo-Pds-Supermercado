package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();

    Optional<Producto> findByIdAndActivoTrue(Long id);

    List<Producto> findByActivoTrueAndNombreContainingIgnoreCase(String nombre);
}
