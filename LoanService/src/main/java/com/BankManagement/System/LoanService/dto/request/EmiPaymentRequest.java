package com.BankManagement.System.LoanService.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EmiPaymentRequest {

    @NotNull
    @Positive
    private BigDecimal amount;
}