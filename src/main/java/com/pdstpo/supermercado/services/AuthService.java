package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.AuthResponse;
import com.pdstpo.supermercado.dto.LoginRequest;
import com.pdstpo.supermercado.dto.RegisterRequest;
import com.pdstpo.supermercado.entities.Carrito;
import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.Usuario;
import com.pdstpo.supermercado.exceptions.BusinessException;
import com.pdstpo.supermercado.exceptions.InvalidCredentialsException;
import com.pdstpo.supermercado.repositories.ClienteRepository;
import com.pdstpo.supermercado.repositories.UsuarioRepository;
import com.pdstpo.supermercado.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UsuarioRepository usuarioRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse registrarCliente(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("El email ya esta registrado");
        }

        Cliente cliente = new Cliente(
                request.nombre(),
                request.apellido(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.direccionEnvio(),
                request.telefono());
        cliente.asignarCarrito(new Carrito());
        Cliente guardado = clienteRepository.save(cliente);

        return AuthResponse.from(jwtUtil.generarToken(guardado), guardado);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), usuario.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return AuthResponse.from(jwtUtil.generarToken(usuario), usuario);
    }
}
