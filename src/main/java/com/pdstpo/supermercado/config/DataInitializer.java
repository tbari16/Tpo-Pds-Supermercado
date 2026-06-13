package com.pdstpo.supermercado.config;

import com.pdstpo.supermercado.entities.Administrador;
import com.pdstpo.supermercado.entities.CategoriaCompuesta;
import com.pdstpo.supermercado.entities.CategoriaHoja;
import com.pdstpo.supermercado.entities.Carrito;
import com.pdstpo.supermercado.entities.Cliente;
import com.pdstpo.supermercado.entities.Producto;
import com.pdstpo.supermercado.entities.UnidadMedida;
import com.pdstpo.supermercado.repositories.AdministradorRepository;
import com.pdstpo.supermercado.repositories.CategoriaComponenteRepository;
import com.pdstpo.supermercado.repositories.ClienteRepository;
import com.pdstpo.supermercado.repositories.ProductoRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner cargarDatosIniciales(
            CategoriaComponenteRepository categoriaRepository,
            ProductoRepository productoRepository,
            ClienteRepository clienteRepository,
            AdministradorRepository administradorRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoriaRepository.count() == 0 && productoRepository.count() == 0) {
                CategoriaCompuesta alimentos = new CategoriaCompuesta("Alimentos", "Productos alimenticios");
                CategoriaHoja cereales = new CategoriaHoja("Cereales", "Arroz, fideos y granos");
                CategoriaHoja lacteos = new CategoriaHoja("Lacteos", "Leches, quesos y yogures");

                alimentos.agregar(cereales);
                alimentos.agregar(lacteos);
                categoriaRepository.save(alimentos);

                productoRepository.save(new Producto(
                        "Arroz largo fino",
                        "Arroz de alta calidad para comidas diarias",
                        new BigDecimal("450.00"),
                        100,
                        UnidadMedida.KG,
                        "https://example.com/arroz.jpg",
                        cereales));
                productoRepository.save(new Producto(
                        "Fideos mostachol",
                        "Pasta seca de semola",
                        new BigDecimal("620.00"),
                        80,
                        UnidadMedida.UNIDAD,
                        "https://example.com/fideos.jpg",
                        cereales));
                productoRepository.save(new Producto(
                        "Leche entera",
                        "Leche entera larga vida",
                        new BigDecimal("900.00"),
                        50,
                        UnidadMedida.LT,
                        "https://example.com/leche.jpg",
                        lacteos));
            }

            if (clienteRepository.count() == 0) {
                Cliente cliente = new Cliente(
                        "Juan",
                        "Perez",
                        "juan@email.com",
                        passwordEncoder.encode("password-demo"),
                        "Av. Corrientes 1234",
                        "1122334455");
                cliente.asignarCarrito(new Carrito());
                clienteRepository.save(cliente);
            }

            if (administradorRepository.count() == 0) {
                Administrador administrador = new Administrador(
                        "Admin",
                        "Demo",
                        "admin@email.com",
                        passwordEncoder.encode("password-demo"),
                        "ADM-001");
                administradorRepository.save(administrador);
            }
        };
    }
}
