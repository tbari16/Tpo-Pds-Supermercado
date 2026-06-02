package com.pdstpo.supermercado.factory;

import com.pdstpo.supermercado.domain.payment.MetodoPago;
import com.pdstpo.supermercado.entities.MetodoPagoEnum;
import com.pdstpo.supermercado.exceptions.BusinessException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class MetodoPagoFactory {

    private final Map<MetodoPagoEnum, MetodoPago> estrategias;

    public MetodoPagoFactory(List<MetodoPago> estrategias) {
        this.estrategias = new EnumMap<>(MetodoPagoEnum.class);
        estrategias.forEach(estrategia -> this.estrategias.put(estrategia.getTipo(), estrategia));
    }

    public MetodoPago crearMetodoPago(MetodoPagoEnum tipo) {
        MetodoPago estrategia = estrategias.get(tipo);
        if (estrategia == null) {
            throw new BusinessException("Metodo de pago no soportado: " + tipo);
        }
        return estrategia;
    }
}
