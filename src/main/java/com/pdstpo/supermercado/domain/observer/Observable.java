package com.pdstpo.supermercado.domain.observer;

public interface Observable {

    void agregarObservador(ObservadorPedido observador);

    void eliminarObservador(ObservadorPedido observador);

    void notificar();
}
