package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
}
