package com.pdstpo.supermercado.services;

import com.pdstpo.supermercado.domain.payment.ResultadoPago;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.exceptions.PaymentRejectedException;
import com.pdstpo.supermercado.factory.MetodoPagoFactory;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class PagoService {

    private final MetodoPagoFactory metodoPagoFactory;

    public PagoService(MetodoPagoFactory metodoPagoFactory) {
        this.metodoPagoFactory = metodoPagoFactory;
    }

    public ResultadoPago ejecutarPago(MetodoPagoEnum tipo, BigDecimal monto, String referenciaPedido) {
        ResultadoPago resultado = metodoPagoFactory.crearMetodoPago(tipo)
                .procesarPago(monto, referenciaPedido);

        if (!resultado.isExitoso()) {
            throw new PaymentRejectedException(resultado.getMensaje());
        }

        return resultado;
    }
}
