package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.domain.payment.ResultadoPago;
import com.pdstpo.supermercado.dto.ConfirmarCompraRequest;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.entities.Carrito;
import com.pdstpo.supermercado.entities.CarritoItem;
import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.entities.PedidoItem;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.exceptions.BusinessException;
import com.pdstpo.supermercado.exceptions.InsufficientStockException;
import com.pdstpo.supermercado.repositories.PedidoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutFacade {

    private final CarritoService carritoService;
    private final PagoService pagoService;
    private final NotificacionService notificacionService;
    private final PedidoRepository pedidoRepository;

    public CheckoutFacade(
            CarritoService carritoService,
            PagoService pagoService,
            NotificacionService notificacionService,
            PedidoRepository pedidoRepository) {
        this.carritoService = carritoService;
        this.pagoService = pagoService;
        this.notificacionService = notificacionService;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public PedidoResponse confirmarCompra(Long clienteId, ConfirmarCompraRequest request) {
        Carrito carrito = carritoService.obtenerCarrito(clienteId);
        validarCarrito(carrito);
        validarStock(carrito.getItems());

        Cliente cliente = carrito.getCliente();
        Pedido pedido = crearPedidoDesdeCarrito(cliente, carrito, request);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        String referenciaPedido = "PED-" + pedidoGuardado.getId();
        ResultadoPago resultadoPago = pagoService.ejecutarPago(
                request.metodoPago(),
                pedidoGuardado.getTotal(),
                referenciaPedido);

        pedidoGuardado.setReferenciaPago(resultadoPago.getReferenciaPago());
        notificacionService.registrarObservadores(pedidoGuardado);
        pedidoGuardado.pagar();

        descontarStock(carrito.getItems());
        carrito.vaciar();

        return PedidoResponse.from(pedidoGuardado);
    }

    private void validarCarrito(Carrito carrito) {
        if (carrito.estaVacio()) {
            throw new BusinessException("El carrito esta vacio");
        }
    }

    private void validarStock(List<CarritoItem> items) {
        items.forEach(item -> {
            Producto producto = item.getProducto();
            if (!producto.tieneStock(item.getCantidad())) {
                throw new InsufficientStockException("Stock insuficiente para el producto " + producto.getNombre());
            }
        });
    }

    private Pedido crearPedidoDesdeCarrito(Cliente cliente, Carrito carrito, ConfirmarCompraRequest request) {
        Pedido pedido = new Pedido(cliente, request.direccionEnvio(), request.metodoPago());
        carrito.getItems().forEach(item -> pedido.agregarItem(new PedidoItem(
                pedido,
                item.getProducto(),
                item.getCantidad(),
                item.getPrecioUnitario())));
        cliente.agregarPedido(pedido);
        return pedido;
    }

    private void descontarStock(List<CarritoItem> items) {
        items.forEach(item -> item.getProducto().reducirStock(item.getCantidad()));
    }
}
