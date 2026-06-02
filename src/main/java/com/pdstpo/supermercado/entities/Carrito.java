package com.pdstpo.supermercado.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Cliente cliente;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarritoItem> items = new ArrayList<>();

    public void agregarProducto(Producto producto, int cantidad) {
        validarCantidadPositiva(cantidad);
        CarritoItem itemExistente = buscarItem(producto);

        if (itemExistente != null) {
            int nuevaCantidad = itemExistente.getCantidad() + cantidad;
            itemExistente.setCantidad(nuevaCantidad);
            return;
        }

        CarritoItem item = new CarritoItem(this, producto, cantidad, producto.getPrecio());
        items.add(item);
    }

    public void modificarCantidad(Producto producto, int cantidad) {
        CarritoItem item = buscarItem(producto);
        if (item == null) {
            return;
        }

        if (cantidad <= 0) {
            eliminarProducto(producto);
            return;
        }

        item.setCantidad(cantidad);
    }

    public void eliminarProducto(Producto producto) {
        items.removeIf(item -> item.getProducto().getId().equals(producto.getId()));
    }

    public BigDecimal calcularTotal() {
        return items.stream()
                .map(CarritoItem::calcularSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean estaVacio() {
        return items.isEmpty();
    }

    public void vaciar() {
        items.clear();
    }

    private CarritoItem buscarItem(Producto producto) {
        return items.stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst()
                .orElse(null);
    }

    private void validarCantidadPositiva(int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }
    }

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<CarritoItem> getItems() {
        return items;
    }
}
