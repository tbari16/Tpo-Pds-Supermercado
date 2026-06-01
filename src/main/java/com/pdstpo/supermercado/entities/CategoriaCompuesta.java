package com.pdstpo.supermercado.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class CategoriaCompuesta extends CategoriaComponente {

    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoriaComponente> subcategorias = new ArrayList<>();

    protected CategoriaCompuesta() {
    }

    public CategoriaCompuesta(String nombre, String descripcion) {
        super(nombre, descripcion);
    }

    @Override
    public List<Producto> listarProductos() {
        return subcategorias.stream()
                .flatMap(categoria -> categoria.listarProductos().stream())
                .toList();
    }

    @Override
    public int calcularCantidadProductos() {
        return subcategorias.stream()
                .mapToInt(CategoriaComponente::calcularCantidadProductos)
                .sum();
    }

    @Override
    public boolean esHoja() {
        return false;
    }

    public void agregar(CategoriaComponente categoria) {
        if (!subcategorias.contains(categoria)) {
            subcategorias.add(categoria);
            categoria.setPadre(this);
        }
    }

    public void eliminar(CategoriaComponente categoria) {
        if (subcategorias.remove(categoria)) {
            categoria.setPadre(null);
        }
    }

    public List<CategoriaComponente> getSubcategorias() {
        return subcategorias;
    }
}
