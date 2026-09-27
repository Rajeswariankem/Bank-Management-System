package com.BankManagement.System.AccountService.dto.Response;

import com.BankManagement.System.AccountService.enums.AccountStatus;
import com.BankManagement.System.AccountService.enums.AccountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private String accountNumber;
    private Long customerId;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal balance;
    private LocalDateTime createdAt;
}