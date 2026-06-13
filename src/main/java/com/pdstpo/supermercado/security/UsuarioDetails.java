package com.pdstpo.supermercado.security;

import com.pdstpo.supermercado.entities.RolUsuario;
import com.pdstpo.supermercado.entities.Usuario;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String passwordHash;
    private final RolUsuario rol;
    private final boolean activo;

    public UsuarioDetails(Usuario usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.passwordHash = usuario.getPasswordHash();
        this.rol = usuario.getRol();
        this.activo = usuario.isActivo();
    }

    public Long getId() {
        return id;
    }

    public RolUsuario getRol() {
        return rol;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
