package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.CategoriaResponse;
import com.pdstpo.supermercado.dto.ProductoResponse;
import com.pdstpo.supermercado.entities.CategoriaComponente;
import com.pdstpo.supermercado.exceptions.ResourceNotFoundException;
import com.pdstpo.supermercado.repositories.CategoriaComponenteRepository;
import com.pdstpo.supermercado.repositories.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogoService {

    private final ProductoRepository productoRepository;
    private final CategoriaComponenteRepository categoriaRepository;

    public CatalogoService(ProductoRepository productoRepository, CategoriaComponenteRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarProductosActivos() {
        return productoRepository.findByActivoTrue().stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerProductoPorId(Long id) {
        return productoRepository.findByIdAndActivoTrue(id)
                .map(ProductoResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> buscarPorNombre(String nombre) {
        return productoRepository.findByActivoTrueAndNombreContainingIgnoreCase(nombre).stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> buscarPorCategoria(Long categoriaId) {
        CategoriaComponente categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"));

        return categoria.listarProductos().stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> obtenerCategorias() {
        return categoriaRepository.findByPadreIsNull().stream()
                .map(CategoriaResponse::from)
                .toList();
    }
}