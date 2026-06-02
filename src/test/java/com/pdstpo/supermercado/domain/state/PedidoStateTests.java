package com.pdstpo.supermercado.domain.state;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.exceptions.InvalidStateTransitionException;
import org.junit.jupiter.api.Test;

class PedidoStateTests {

    @Test
    void permiteTransicionCompletaPendientePagadoEnviadoEntregado() {
        Pedido pedido = nuevoPedido();

        pedido.pagar();
        pedido.enviar();
        pedido.entregar();

        assertThat(pedido.getEstadoEnum()).isEqualTo(EstadoPedidoEnum.ENTREGADO);
    }

    @Test
    void noPermiteEnviarPedidoPendiente() {
        Pedido pedido = nuevoPedido();

        assertThatThrownBy(pedido::enviar)
                .isInstanceOf(InvalidStateTransitionException.class)
                .hasMessageContaining("pedido pendiente");
    }

    @Test
    void permiteCancelarPedidoPagado() {
        Pedido pedido = nuevoPedido();

        pedido.pagar();
        pedido.cancelar();

        assertThat(pedido.getEstadoEnum()).isEqualTo(EstadoPedidoEnum.CANCELADO);
    }

    private Pedido nuevoPedido() {
        Cliente cliente = new Cliente(
                "Juan",
                "Perez",
                "juan-state@email.com",
                "password-demo",
                "Av. Corrientes 1234",
                "1122334455");
        return new Pedido(cliente, "Av. Corrientes 1234", MetodoPagoEnum.MERCADO_PAGO);
    }
}
