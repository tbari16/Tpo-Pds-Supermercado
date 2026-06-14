package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.dto.PerfilUsuarioRequest;
import com.pdstpo.supermercado.dto.PerfilUsuarioResponse;
import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.Usuario;
import com.pdstpo.supermercado.exceptions.ResourceNotFoundException;
import com.pdstpo.supermercado.repositories.ClienteRepository;
import com.pdstpo.supermercado.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public PerfilUsuarioResponse verPerfil(Long clienteId) {
        return PerfilUsuarioResponse.from(obtenerCliente(clienteId));
    }

    @Transactional
    public PerfilUsuarioResponse editarPerfil(Long clienteId, PerfilUsuarioRequest request) {
        Cliente cliente = obtenerCliente(clienteId);
        cliente.setNombre(request.nombre());
        cliente.setApellido(request.apellido());
        cliente.setDireccionEnvio(request.direccionEnvio());
        cliente.setTelefono(request.telefono());
        return PerfilUsuarioResponse.from(cliente);
    }

    private Cliente obtenerCliente(Long clienteId) {
        return clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
    }
}
