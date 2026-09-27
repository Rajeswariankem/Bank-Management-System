package com.BankManagement.System.LoanService.dto.response;

import com.BankManagement.System.LoanService.enums.RepaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RepaymentResponse(
        String repaymentNumber,
        String loanNumber,
        Long customerId,
        BigDecimal amount,
        BigDecimal remainingAmount,
        RepaymentStatus status,
        LocalDateTime paymentDate
) {
}