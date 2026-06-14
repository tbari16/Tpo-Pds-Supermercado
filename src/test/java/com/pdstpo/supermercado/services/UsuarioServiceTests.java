package com.pdstpo.supermercado.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.pdstpo.supermercado.dto.AgregarCarritoRequest;
import com.pdstpo.supermercado.dto.AuthResponse;
import com.pdstpo.supermercado.dto.ConfirmarCompraRequest;
import com.pdstpo.supermercado.dto.PerfilUsuarioRequest;
import com.pdstpo.supermercado.dto.PerfilUsuarioResponse;
import com.pdstpo.supermercado.dto.RegisterRequest;
import com.pdstpo.supermercado.entities.EstadoPedidoEnum;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.entities.RolUsuario;
import com.pdstpo.supermercado.exceptions.ForbiddenOperationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class UsuarioServiceTests {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthService authService;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private CheckoutFacade checkoutFacade;

    @Autowired
    private PedidoService pedidoService;

    @Test
    void editarPerfilActualizaDatosDelClienteAutenticado() {
        PerfilUsuarioResponse perfil = usuarioService.editarPerfil(
                1L,
                new PerfilUsuarioRequest("Juan", "Actualizado", "Av. Siempre Viva 742", "1100110022"));

        assertThat(perfil.apellido()).isEqualTo("Actualizado");
        assertThat(perfil.direccionEnvio()).isEqualTo("Av. Siempre Viva 742");
        assertThat(perfil.telefono()).isEqualTo("1100110022");
    }

    @Test
    void clienteNoPuedeConsultarPedidoDeOtroCliente() {
        AuthResponse otroCliente = authService.registrarCliente(new RegisterRequest(
                "Laura",
                "Perez",
                "laura.pedido@email.com",
                "password-demo",
                "Av. Cabildo 2000",
                "1133445566"));

        carritoService.agregarProducto(1L, new AgregarCarritoRequest(3L, 1));
        Long pedidoId = checkoutFacade.confirmarCompra(
                1L,
                new ConfirmarCompraRequest(MetodoPagoEnum.TARJETA_CREDITO, "Av. Corrientes 1234"))
                .id();

        assertThatThrownBy(() -> pedidoService.obtenerPedidoParaUsuario(
                pedidoId,
                otroCliente.usuario().id(),
                RolUsuario.CLIENTE))
                .isInstanceOf(ForbiddenOperationException.class);

        assertThat(pedidoService.obtenerPedidoParaUsuario(pedidoId, 2L, RolUsuario.ADMINISTRADOR).estado())
                .isEqualTo(EstadoPedidoEnum.PAGADO);
    }
}
