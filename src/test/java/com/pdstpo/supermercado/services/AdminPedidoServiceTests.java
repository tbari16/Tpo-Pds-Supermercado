package com.pdstpo.supermercado.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;

import com.pdstpo.supermercado.dto.ActualizarEstadoPedidoRequest;
import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.ConfirmarCompraRequest;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.entities.Administrador;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.HistorialEstadoPedido;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.repositories.AdministradorRepository;
import com.pdstpo.supermercado.repositories.HistorialEstadoPedidoRepository;
import com.pdstpo.supermercado.repositories.NotificacionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AdminPedidoServiceTests {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private CheckoutFacade checkoutFacade;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private HistorialEstadoPedidoRepository historialRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Test
    void actualizarEstadoPedidoRegistraHistorialYNotifica() {
        Long clienteId = 1L;
        Long productoId = 2L;
        Administrador administrador = administradorRepository.findAll().getFirst();

        carritoService.agregarProducto(clienteId, new AgregarCarritoRequest(productoId, 1));
        PedidoResponse pedidoPagado = checkoutFacade.confirmarCompra(
                clienteId,
                new ConfirmarCompraRequest(MetodoPagoEnum.TRANSFERENCIA, "Av. Corrientes 1234"));

        PedidoResponse pedidoEnviado = adminService.actualizarEstadoPedido(
                pedidoPagado.id(),
                new ActualizarEstadoPedidoRequest(EstadoPedidoEnum.ENVIADO),
                administrador.getId());

        assertThat(pedidoEnviado.estado()).isEqualTo(EstadoPedidoEnum.ENVIADO);

        assertThat(historialRepository.findByPedidoIdOrderByFechaCambioAsc(pedidoPagado.id()))
                .extracting(HistorialEstadoPedido::getEstadoAnterior, HistorialEstadoPedido::getEstadoNuevo)
                .containsExactly(tuple(EstadoPedidoEnum.PAGADO, EstadoPedidoEnum.ENVIADO));

        assertThat(notificacionRepository.findByPedidoId(pedidoPagado.id())).hasSize(6);
    }
}
