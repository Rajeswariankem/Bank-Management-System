package com.BankManagement.System.TransactionService.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class TransactionIdGenerator {

    private final AtomicLong counter = new AtomicLong(1);

    public String generate() {

        return "TXN"
                + LocalDate.now().toString().replace("-", "")
                + String.format("%05d", counter.getAndIncrement());
    }
}