package com.BankManagement.System.AccountService.enums;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum AccountType {

        SAVINGS(new BigDecimal("100.00")),
        CURRENT(new BigDecimal("500.00"));

        private final BigDecimal minimumBalance;

        AccountType(BigDecimal minimumBalance) {
            this.minimumBalance = minimumBalance;
        }
    }

