package com.pdstpo.supermercado.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Cliente extends Usuario {

    private String direccionEnvio;

    private String telefono;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private Carrito carrito;

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos = new ArrayList<>();

    protected Cliente() {
    }

    public Cliente(String nombre, String apellido, String email, String passwordHash, String direccionEnvio,
            String telefono) {
        super(nombre, apellido, email, passwordHash, RolUsuario.CLIENTE);
        this.direccionEnvio = direccionEnvio;
        this.telefono = telefono;
    }

    public void asignarCarrito(Carrito carrito) {
        this.carrito = carrito;
        carrito.setCliente(this);
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void agregarPedido(Pedido pedido) {
        if (!pedidos.contains(pedido)) {
            pedidos.add(pedido);
            pedido.setCliente(this);
        }
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }
}
