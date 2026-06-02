package com.pdstpo.supermercado.domain.payment;

import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class PagoTransferencia implements MetodoPago {

    @Override
    public ResultadoPago procesarPago(BigDecimal monto, String referenciaPedido) {
        String referenciaPago = "TR-" + referenciaPedido;
        return ResultadoPago.aprobado(referenciaPago, "Pago por transferencia aprobado por $" + monto);
    }

    @Override
    public MetodoPagoEnum getTipo() {
        return MetodoPagoEnum.TRANSFERENCIA;
    }
}
