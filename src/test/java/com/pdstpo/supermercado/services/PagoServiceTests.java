package com.pdstpo.supermercado.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.pdstpo.supermercado.domain.payment.PagoMercadoPago;
import com.pdstpo.supermercado.domain.payment.PagoTarjetaCredito;
import com.pdstpo.supermercado.domain.payment.PagoTransferencia;
import com.pdstpo.supermercado.domain.payment.ResultadoPago;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.factory.MetodoPagoFactory;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class PagoServiceTests {

    @Test
    void ejecutarPagoUsaLaEstrategiaSeleccionada() {
        MetodoPagoFactory factory = new MetodoPagoFactory(List.of(
                new PagoTarjetaCredito(),
                new PagoMercadoPago(),
                new PagoTransferencia()));
        PagoService pagoService = new PagoService(factory);

        ResultadoPago resultado = pagoService.ejecutarPago(
                MetodoPagoEnum.MERCADO_PAGO,
                new BigDecimal("1500.00"),
                "PED-1");

        assertThat(resultado.isExitoso()).isTrue();
        assertThat(resultado.getReferenciaPago()).isEqualTo("MP-PED-1");
    }
}
