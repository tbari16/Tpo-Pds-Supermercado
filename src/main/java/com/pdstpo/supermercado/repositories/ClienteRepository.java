package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
