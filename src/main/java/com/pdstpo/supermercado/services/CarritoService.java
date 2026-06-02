package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.CarritoResponse;
import com.pdstpo.supermercado.dto.ModificarCantidadRequest;
import com.pdstpo.supermercado.entities.Carrito;
import com.pdstpo.supermercado.entities.CarritoItem;
import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.exceptions.BusinessException;
import com.pdstpo.supermercado.exceptions.InsufficientStockException;
import com.pdstpo.supermercado.exceptions.ResourceNotFoundException;
import com.pdstpo.supermercado.repositories.CarritoRepository;
import com.pdstpo.supermercado.repositories.ClienteRepository;
import com.pdstpo.supermercado.repositories.ProductoRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    public CarritoService(
            CarritoRepository carritoRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository) {
        this.carritoRepository = carritoRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public CarritoResponse verCarrito(Long clienteId) {
        return CarritoResponse.from(obtenerCarrito(clienteId));
    }

    @Transactional
    public CarritoResponse agregarProducto(Long clienteId, AgregarCarritoRequest request) {
        Carrito carrito = obtenerCarrito(clienteId);
        Producto producto = obtenerProductoActivo(request.productoId());
        int cantidadTotal = cantidadActualEnCarrito(carrito, producto) + request.cantidad();

        validarStock(producto, cantidadTotal);
        carrito.agregarProducto(producto, request.cantidad());

        return CarritoResponse.from(carrito);
    }

    @Transactional
    public CarritoResponse modificarCantidad(Long clienteId, Long productoId, ModificarCantidadRequest request) {
        Carrito carrito = obtenerCarrito(clienteId);
        Producto producto = obtenerProductoActivo(productoId);

        if (request.cantidad() > 0) {
            validarStock(producto, request.cantidad());
        }

        carrito.modificarCantidad(producto, request.cantidad());
        return CarritoResponse.from(carrito);
    }

    @Transactional
    public CarritoResponse eliminarProducto(Long clienteId, Long productoId) {
        Carrito carrito = obtenerCarrito(clienteId);
        Producto producto = obtenerProductoActivo(productoId);

        carrito.eliminarProducto(producto);
        return CarritoResponse.from(carrito);
    }

    @Transactional
    public void vaciarCarrito(Long clienteId) {
        Carrito carrito = obtenerCarrito(clienteId);
        carrito.vaciar();
    }

    @Transactional
    public BigDecimal verTotal(Long clienteId) {
        return obtenerCarrito(clienteId).calcularTotal();
    }

    public Carrito obtenerCarrito(Long clienteId) {
        return carritoRepository.findByClienteId(clienteId)
                .orElseGet(() -> crearCarritoParaCliente(clienteId));
    }

    private Carrito crearCarritoParaCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        Carrito carrito = new Carrito();
        cliente.asignarCarrito(carrito);
        return carritoRepository.save(carrito);
    }

    private Producto obtenerProductoActivo(Long productoId) {
        Producto producto = productoRepository.findByIdAndActivoTrue(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (!producto.isActivo()) {
            throw new BusinessException("No se puede operar con un producto inactivo");
        }
        return producto;
    }

    private int cantidadActualEnCarrito(Carrito carrito, Producto producto) {
        return carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .mapToInt(CarritoItem::getCantidad)
                .findFirst()
                .orElse(0);
    }

    private void validarStock(Producto producto, int cantidad) {
        if (!producto.tieneStock(cantidad)) {
            throw new InsufficientStockException("Stock insuficiente para el producto " + producto.getNombre());
        }
    }
}
