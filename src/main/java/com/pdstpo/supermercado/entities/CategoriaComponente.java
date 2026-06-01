package com.pdstpo.supermercado.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class CategoriaComponente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    private CategoriaCompuesta padre;

    protected CategoriaComponente() {
    }

    protected CategoriaComponente(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public abstract List<Producto> listarProductos();

    public abstract int calcularCantidadProductos();

    public abstract boolean esHoja();

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public CategoriaCompuesta getPadre() {
        return padre;
    }

    public void setPadre(CategoriaCompuesta padre) {
        this.padre = padre;
    }
}
