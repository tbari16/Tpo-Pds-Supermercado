package com.pdstpo.supermercado.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.pdstpo.supermercado.dto.AuthResponse;
import com.pdstpo.supermercado.dto.LoginRequest;
import com.pdstpo.supermercado.dto.RegisterRequest;
import com.pdstpo.supermercado.entities.RolUsuario;
import com.pdstpo.supermercado.repositories.ClienteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Test
    void loginDevuelveTokenParaUsuarioDemo() {
        AuthResponse response = authService.login(new LoginRequest("juan@email.com", "password-demo"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.usuario().email()).isEqualTo("juan@email.com");
        assertThat(response.usuario().rol()).isEqualTo(RolUsuario.CLIENTE);
    }

    @Test
    void registrarClienteCreaUsuarioConCarritoYDevuelveToken() {
        AuthResponse response = authService.registrarCliente(new RegisterRequest(
                "Ana",
                "Gomez",
                "ana.auth@email.com",
                "password-demo",
                "Av. Santa Fe 1000",
                "1199887766"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.usuario().rol()).isEqualTo(RolUsuario.CLIENTE);
        assertThat(clienteRepository.findById(response.usuario().id()))
                .get()
                .satisfies(cliente -> assertThat(cliente.getCarrito()).isNotNull());
    }
}
