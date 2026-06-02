package com.pdstpo.supermercado.domain.observer;

import static org.assertj.core.api.Assertions.assertThat;

import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import org.junit.jupiter.api.Test;

class PedidoObserverTests {

    @Test
    void notificaObservadoresCuandoCambiaDeEstado() {
        Pedido pedido = nuevoPedido();
        ObservadorDePrueba observador = new ObservadorDePrueba();

        pedido.agregarObservador(observador);
        pedido.pagar();

        assertThat(observador.notificacionesRecibidas).isEqualTo(1);
        assertThat(observador.ultimoEstado).isEqualTo(EstadoPedidoEnum.PAGADO);
    }

    private Pedido nuevoPedido() {
        Cliente cliente = new Cliente(
                "Juan",
                "Perez",
                "juan-observer@email.com",
                "password-demo",
                "Av. Corrientes 1234",
                "1122334455");
        return new Pedido(cliente, "Av. Corrientes 1234", MetodoPagoEnum.MERCADO_PAGO);
    }

    private static class ObservadorDePrueba implements ObservadorPedido {

        private int notificacionesRecibidas;
        private EstadoPedidoEnum ultimoEstado;

        @Override
        public void actualizar(Pedido pedido, EstadoPedidoEnum nuevoEstado) {
            notificacionesRecibidas++;
            ultimoEstado = nuevoEstado;
        }
    }
}
