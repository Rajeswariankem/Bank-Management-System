package com.BankManagement.System.TransactionService.dto.response;

import com.BankManagement.System.TransactionService.enums.TransactionStatus;
import com.BankManagement.System.TransactionService.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private String transactionId;

    private String sourceAccountNumber;

    private String destinationAccountNumber;

    private BigDecimal amount;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;

    private String description;

    private LocalDateTime createdAt;
}