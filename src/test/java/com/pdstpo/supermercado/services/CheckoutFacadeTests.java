package com.pdstpo.supermercado.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.ConfirmarCompraRequest;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.repositories.NotificacionRepository;
import com.pdstpo.supermercado.repositories.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class CheckoutFacadeTests {

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private CheckoutFacade checkoutFacade;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Test
    void confirmarCompraPagaPedidoDescuentaStockVaciaCarritoYNotifica() {
        Long clienteId = 1L;
        Long productoId = 1L;

        Producto productoAntes = productoRepository.findById(productoId).orElseThrow();
        int stockInicial = productoAntes.getStock();

        carritoService.agregarProducto(clienteId, new AgregarCarritoRequest(productoId, 2));

        PedidoResponse pedido = checkoutFacade.confirmarCompra(
                clienteId,
                new ConfirmarCompraRequest(MetodoPagoEnum.MERCADO_PAGO, "Av. Corrientes 1234"));

        Producto productoDespues = productoRepository.findById(productoId).orElseThrow();

        assertThat(pedido.estado()).isEqualTo(EstadoPedidoEnum.PAGADO);
        assertThat(pedido.referenciaPago()).isEqualTo("MP-PED-" + pedido.id());
        assertThat(productoDespues.getStock()).isEqualTo(stockInicial - 2);
        assertThat(carritoService.verCarrito(clienteId).items()).isEmpty();
        assertThat(notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(clienteId)).hasSize(3);
    }
}
