package com.pdstpo.supermercado.domain.payment;

import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class PagoMercadoPago implements MetodoPago {

    @Override
    public ResultadoPago procesarPago(BigDecimal monto, String referenciaPedido) {
        String referenciaPago = "MP-" + referenciaPedido;
        return ResultadoPago.aprobado(referenciaPago, "Pago con Mercado Pago aprobado por $" + monto);
    }

    @Override
    public MetodoPagoEnum getTipo() {
        return MetodoPagoEnum.MERCADO_PAGO;
    }
}
