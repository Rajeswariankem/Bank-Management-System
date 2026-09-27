package com.BankManagement.System.AccountService.util;

import org.springframework.stereotype.Component;

@Component
public class AccountNumberGenerator {
    public String generate() {
        return "BANK" + System.currentTimeMillis();
    }
}
