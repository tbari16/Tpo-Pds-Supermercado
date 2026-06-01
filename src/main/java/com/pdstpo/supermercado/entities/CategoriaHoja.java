package com.pdstpo.supermercado.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class CategoriaHoja extends CategoriaComponente {

    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos = new ArrayList<>();

    protected CategoriaHoja() {
    }

    public CategoriaHoja(String nombre, String descripcion) {
        super(nombre, descripcion);
    }

    @Override
    public List<Producto> listarProductos() {
        return productos.stream()
                .filter(Producto::isActivo)
                .toList();
    }

    @Override
    public int calcularCantidadProductos() {
        return listarProductos().size();
    }

    @Override
    public boolean esHoja() {
        return true;
    }

    public void agregarProducto(Producto producto) {
        if (!productos.contains(producto)) {
            productos.add(producto);
            producto.setCategoria(this);
        }
    }

    public void quitarProducto(Producto producto) {
        if (productos.remove(producto)) {
            producto.setCategoria(null);
        }
    }

    public List<Producto> getProductos() {
        return productos;
    }
}
