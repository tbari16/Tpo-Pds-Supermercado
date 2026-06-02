package com.pdstpo.supermercado.entities;

import com.pdstpo.supermercado.domain.observer.Observable;
import com.pdstpo.supermercado.domain.observer.ObservadorPedido;
import com.pdstpo.supermercado.domain.state.EstadoFactory;
import com.pdstpo.supermercado.domain.state.EstadoPedido;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido implements Observable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Cliente cliente;

    @Column(nullable = false)
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(nullable = false)
    private String direccionEnvio;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedidoEnum estadoEnum = EstadoPedidoEnum.PENDIENTE;

    @Transient
    private EstadoPedido estadoActual = EstadoFactory.from(EstadoPedidoEnum.PENDIENTE);

    @Transient
    private List<ObservadorPedido> observadores = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private MetodoPagoEnum metodoPago;

    private String referenciaPago;

    protected Pedido() {
    }

    public Pedido(Cliente cliente, String direccionEnvio, MetodoPagoEnum metodoPago) {
        this.cliente = cliente;
        this.direccionEnvio = direccionEnvio;
        this.metodoPago = metodoPago;
        this.estadoEnum = EstadoPedidoEnum.PENDIENTE;
        reconstruirEstadoActual();
    }

    public void pagar() {
        estadoActual.pagar(this);
    }

    public void enviar() {
        estadoActual.enviar(this);
    }

    public void entregar() {
        estadoActual.entregar(this);
    }

    public void cancelar() {
        estadoActual.cancelar(this);
    }

    public void cambiarEstado(EstadoPedido nuevoEstado) {
        this.estadoActual = nuevoEstado;
        this.estadoEnum = nuevoEstado.getNombre();
        notificar();
    }

    public void reconstruirEstadoActual() {
        this.estadoActual = EstadoFactory.from(estadoEnum);
    }

    public void agregarItem(PedidoItem item) {
        items.add(item);
        item.setPedido(this);
        total = calcularTotal();
    }

    public BigDecimal calcularTotal() {
        return items.stream()
                .map(PedidoItem::calcularSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public void agregarObservador(ObservadorPedido observador) {
        if (!observadores.contains(observador)) {
            observadores.add(observador);
        }
    }

    @Override
    public void eliminarObservador(ObservadorPedido observador) {
        observadores.remove(observador);
    }

    @Override
    public void notificar() {
        observadores.forEach(observador -> observador.actualizar(this, estadoEnum));
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

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public List<PedidoItem> getItems() {
        return items;
    }

    public EstadoPedidoEnum getEstadoEnum() {
        return estadoEnum;
    }

    public EstadoPedido getEstadoActual() {
        return estadoActual;
    }

    public MetodoPagoEnum getMetodoPago() {
        return metodoPago;
    }

    public String getReferenciaPago() {
        return referenciaPago;
    }

    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }
}
