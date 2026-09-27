package com.BankManagement.System.LoanService.dto.response;

import com.BankManagement.System.LoanService.enums.AccountStatus;
import com.BankManagement.System.LoanService.enums.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        String accountNumber,
        Long customerId,
        AccountType accountType,
        AccountStatus status,
        BigDecimal balance,
        LocalDateTime createdAt
) {
}