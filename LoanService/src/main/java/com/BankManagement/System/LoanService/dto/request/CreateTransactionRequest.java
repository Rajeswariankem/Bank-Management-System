package com.BankManagement.System.LoanService.dto.request;

import com.BankManagement.System.LoanService.enums.TransactionType;
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

    private BigDecimal amount;

    private TransactionType transactionType;

    private String description;
}