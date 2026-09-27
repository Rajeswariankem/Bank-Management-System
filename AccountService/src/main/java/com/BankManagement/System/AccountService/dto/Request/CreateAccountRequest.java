package com.BankManagement.System.AccountService.dto.Request;

import com.BankManagement.System.AccountService.enums.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccountRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Initial deposit is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Initial deposit must be greater than 0")
    private BigDecimal initialDeposit;
}
