package com.pdstpo.supermercado.dto;

import jakarta.validation.constraints.Min;

public record StockRequest(
        @Min(0) int cantidad) {
}
