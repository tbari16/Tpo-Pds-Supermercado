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
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNotificacion tipo;

    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Column(nullable = false)
    private boolean enviada;

    @Column(nullable = false)
    private LocalDateTime fechaEnvio;

    protected Notificacion() {
    }

    public Notificacion(Usuario usuario, Pedido pedido, TipoNotificacion tipo, String mensaje) {
        this.usuario = usuario;
        this.pedido = pedido;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.enviada = true;
        this.fechaEnvio = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public TipoNotificacion getTipo() {
        return tipo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public boolean isEnviada() {
        return enviada;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }
}
