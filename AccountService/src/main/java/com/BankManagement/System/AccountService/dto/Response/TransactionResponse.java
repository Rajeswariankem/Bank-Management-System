package com.BankManagement.System.AccountService.dto.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private String accountNumber;
    private BigDecimal balance;
    private String message;
}
