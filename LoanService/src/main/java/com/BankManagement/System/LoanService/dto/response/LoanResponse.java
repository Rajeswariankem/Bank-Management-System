package com.BankManagement.System.LoanService.dto.Response;

import com.BankManagement.System.LoanService.enums.LoanStatus;
import com.BankManagement.System.LoanService.enums.LoanType;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record LoanResponse(
        String loanNumber,
        Long customerId,
        String accountNumber,
        LoanType loanType,
        BigDecimal loanAmount,
        BigDecimal interestRate,
        Integer tenureMonths,
        BigDecimal monthlyEmi,
        LoanStatus status,
        LocalDateTime createdAt,
       BigDecimal remainingAmount,
        LocalDateTime disbursedAt
) {
}