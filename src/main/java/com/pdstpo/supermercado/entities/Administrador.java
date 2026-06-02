package com.pdstpo.supermercado.entities;

import jakarta.persistence.Entity;

@Entity
public class Administrador extends Usuario {

    private String legajo;

    protected Administrador() {
    }

    public Administrador(String nombre, String apellido, String email, String passwordHash, String legajo) {
        super(nombre, apellido, email, passwordHash, RolUsuario.ADMINISTRADOR);
        this.legajo = legajo;
    }

    public String getLegajo() {
        return legajo;
    }

    public void setLegajo(String legajo) {
        this.legajo = legajo;
    }
}
