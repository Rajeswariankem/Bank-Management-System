package com.BankManagement.System.LoanService.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class LoanNumberGenerator {

    public String generate() {
        return "LN" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10)
                .toUpperCase();
    }
}