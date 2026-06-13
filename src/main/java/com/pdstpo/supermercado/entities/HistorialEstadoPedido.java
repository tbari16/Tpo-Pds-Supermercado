package com.pdstpo.supermercado.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class HistorialEstadoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedidoEnum estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedidoEnum estadoNuevo;

    @Column(nullable = false)
    private LocalDateTime fechaCambio = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    private Administrador administrador;

    protected HistorialEstadoPedido() {
    }

    public HistorialEstadoPedido(
            Pedido pedido,
            EstadoPedidoEnum estadoAnterior,
            EstadoPedidoEnum estadoNuevo,
            Administrador administrador) {
        this.pedido = pedido;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.administrador = administrador;
    }

    public Long getId() {
        return id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public EstadoPedidoEnum getEstadoAnterior() {
        return estadoAnterior;
    }

    public EstadoPedidoEnum getEstadoNuevo() {
        return estadoNuevo;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public Administrador getAdministrador() {
        return administrador;
    }
}
