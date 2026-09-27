package com.BankManagement.System.TransactionService.dto.request;

import com.BankManagement.System.TransactionService.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransactionRequest {

    private String sourceAccountNumber;

    private String destinationAccountNumber;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotNull
    private TransactionType transactionType;

    private String description;
}