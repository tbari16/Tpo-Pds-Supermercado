package com.pdstpo.supermercado.domain.payment;

import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import java.math.BigDecimal;

public interface MetodoPago {

    ResultadoPago procesarPago(BigDecimal monto, String referenciaPedido);

    MetodoPagoEnum getTipo();
}
