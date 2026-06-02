package com.pdstpo.supermercado.domain.payment;

import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class PagoTarjetaCredito implements MetodoPago {

    @Override
    public ResultadoPago procesarPago(BigDecimal monto, String referenciaPedido) {
        String referenciaPago = "TC-" + referenciaPedido;
        return ResultadoPago.aprobado(referenciaPago, "Pago con tarjeta de credito aprobado por $" + monto);
    }

    @Override
    public MetodoPagoEnum getTipo() {
        return MetodoPagoEnum.TARJETA_CREDITO;
    }
}
