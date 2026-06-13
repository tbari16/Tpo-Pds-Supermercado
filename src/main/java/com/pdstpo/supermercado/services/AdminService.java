package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.CategoriaRequest;
import com.pdstpo.supermercado.dto.CategoriaResponse;
import com.pdstpo.supermercado.dto.ActualizarEstadoPedidoRequest;
import com.pdstpo.supermercado.dto.PedidoResponse;
import com.pdstpo.supermercado.dto.ProductoRequest;
import com.pdstpo.supermercado.dto.ProductoResponse;
import com.pdstpo.supermercado.dto.StockRequest;
import com.pdstpo.supermercado.entities.Administrador;
import com.pdstpo.supermercado.entities.CategoriaComponente;
import com.pdstpo.supermercado.entities.CategoriaCompuesta;
import com.pdstpo.supermercado.entities.CategoriaHoja;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.HistorialEstadoPedido;
import com.pdstpo.supermercado.entities.Pedido;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.exceptions.BusinessException;
import com.pdstpo.supermercado.exceptions.ResourceNotFoundException;
import com.pdstpo.supermercado.repositories.AdministradorRepository;
import com.pdstpo.supermercado.repositories.CategoriaComponenteRepository;
import com.pdstpo.supermercado.repositories.HistorialEstadoPedidoRepository;
import com.pdstpo.supermercado.repositories.PedidoRepository;
import com.pdstpo.supermercado.repositories.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final ProductoRepository productoRepository;
    private final CategoriaComponenteRepository categoriaRepository;
    private final PedidoRepository pedidoRepository;
    private final HistorialEstadoPedidoRepository historialRepository;
    private final AdministradorRepository administradorRepository;
    private final NotificacionService notificacionService;

    public AdminService(
            ProductoRepository productoRepository,
            CategoriaComponenteRepository categoriaRepository,
            PedidoRepository pedidoRepository,
            HistorialEstadoPedidoRepository historialRepository,
            AdministradorRepository administradorRepository,
            NotificacionService notificacionService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.pedidoRepository = pedidoRepository;
        this.historialRepository = historialRepository;
        this.administradorRepository = administradorRepository;
        this.notificacionService = notificacionService;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarProductos() {
        return productoRepository.findAll().stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional
    public ProductoResponse altaProducto(ProductoRequest request) {
        CategoriaHoja categoria = obtenerCategoriaHoja(request.categoriaId());
        Producto producto = new Producto(
                request.nombre(),
                request.descripcion(),
                request.precio(),
                request.stock(),
                request.unidad(),
                request.imagenUrl(),
                categoria);

        Producto guardado = productoRepository.save(producto);
        return ProductoResponse.from(guardado);
    }

    @Transactional
    public ProductoResponse modificarProducto(Long productoId, ProductoRequest request) {
        Producto producto = obtenerProducto(productoId);
        CategoriaHoja categoria = obtenerCategoriaHoja(request.categoriaId());

        producto.setNombre(request.nombre());
        producto.setDescripcion(request.descripcion());
        producto.setPrecio(request.precio());
        producto.setStock(request.stock());
        producto.setUnidad(request.unidad());
        producto.setImagenUrl(request.imagenUrl());
        producto.setCategoria(categoria);

        return ProductoResponse.from(producto);
    }

    @Transactional
    public void bajaProducto(Long productoId) {
        Producto producto = obtenerProducto(productoId);
        producto.setActivo(false);
    }

    @Transactional
    public ProductoResponse gestionarStock(Long productoId, StockRequest request) {
        Producto producto = obtenerProducto(productoId);
        producto.setStock(request.cantidad());
        return ProductoResponse.from(producto);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findByPadreIsNull().stream()
                .map(CategoriaResponse::from)
                .toList();
    }

    @Transactional
    public CategoriaResponse crearCategoria(CategoriaRequest request) {
        CategoriaComponente nuevaCategoria = crearCategoriaSegunTipo(request);

        if (request.padreId() == null) {
            return CategoriaResponse.from(categoriaRepository.save(nuevaCategoria));
        }

        CategoriaCompuesta padre = obtenerCategoriaCompuesta(request.padreId());
        padre.agregar(nuevaCategoria);
        categoriaRepository.save(padre);
        return CategoriaResponse.from(nuevaCategoria);
    }

    @Transactional
    public CategoriaResponse actualizarCategoria(Long categoriaId, CategoriaRequest request) {
        CategoriaComponente categoria = obtenerCategoria(categoriaId);
        categoria.setNombre(request.nombre());
        categoria.setDescripcion(request.descripcion());
        return CategoriaResponse.from(categoria);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidos() {
        return pedidoRepository.findAll().stream()
                .peek(Pedido::reconstruirEstadoActual)
                .map(PedidoResponse::from)
                .toList();
    }

    @Transactional
    public PedidoResponse actualizarEstadoPedido(
            Long pedidoId,
            ActualizarEstadoPedidoRequest request,
            Long adminId) {
        Pedido pedido = obtenerPedido(pedidoId);
        Administrador administrador = obtenerAdministrador(adminId);
        EstadoPedidoEnum estadoAnterior = pedido.getEstadoEnum();

        notificacionService.registrarObservadores(pedido);
        ejecutarTransicion(pedido, request.nuevoEstado());

        historialRepository.save(new HistorialEstadoPedido(
                pedido,
                estadoAnterior,
                pedido.getEstadoEnum(),
                administrador));

        return PedidoResponse.from(pedido);
    }

    private CategoriaComponente crearCategoriaSegunTipo(CategoriaRequest request) {
        if (request.padreId() == null) {
            return new CategoriaCompuesta(request.nombre(), request.descripcion());
        }

        boolean esHoja = request.hoja() == null || request.hoja();
        if (esHoja) {
            return new CategoriaHoja(request.nombre(), request.descripcion());
        }
        return new CategoriaCompuesta(request.nombre(), request.descripcion());
    }

    private Producto obtenerProducto(Long productoId) {
        return productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    private CategoriaComponente obtenerCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"));
    }

    private CategoriaHoja obtenerCategoriaHoja(Long categoriaId) {
        CategoriaComponente categoria = obtenerCategoria(categoriaId);
        if (categoria instanceof CategoriaHoja hoja) {
            return hoja;
        }
        throw new BusinessException("Los productos solo pueden asociarse a categorias hoja");
    }

    private CategoriaCompuesta obtenerCategoriaCompuesta(Long categoriaId) {
        CategoriaComponente categoria = obtenerCategoria(categoriaId);
        if (categoria instanceof CategoriaCompuesta compuesta) {
            return compuesta;
        }
        throw new BusinessException("La categoria padre debe ser una categoria compuesta");
    }

    private Pedido obtenerPedido(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        pedido.reconstruirEstadoActual();
        return pedido;
    }

    private Administrador obtenerAdministrador(Long adminId) {
        if (adminId == null) {
            return null;
        }
        return administradorRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador no encontrado"));
    }

    private void ejecutarTransicion(Pedido pedido, EstadoPedidoEnum nuevoEstado) {
        switch (nuevoEstado) {
            case PAGADO -> pedido.pagar();
            case ENVIADO -> pedido.enviar();
            case ENTREGADO -> pedido.entregar();
            case CANCELADO -> pedido.cancelar();
            case PENDIENTE -> throw new BusinessException("No se puede volver un pedido a pendiente");
        }
    }
}
