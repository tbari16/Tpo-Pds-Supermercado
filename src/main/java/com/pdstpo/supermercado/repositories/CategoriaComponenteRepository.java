package com.pdstpo.supermercado.repositories;

import com.pdstpo.supermercado.entities.CategoriaComponente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaComponenteRepository extends JpaRepository<CategoriaComponente, Long> {

    List<CategoriaComponente> findByPadreIsNull();
}
