package com.BankManagement.System.LoanService.dto.Request;

import com.BankManagement.System.LoanService.enums.LoanType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ApplyLoanRequest {

    @NotNull
    private String accountNumber;

    @NotNull
    private LoanType loanType;

    @NotNull
    @DecimalMin(value = "1000.00")
    private BigDecimal loanAmount;

    @NotNull
    @Min(6)
    private Integer tenureMonths;
}