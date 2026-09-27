package com.BankManagement.System.AccountService.client;

import com.BankManagement.System.AccountService.dto.Request.CreateTransactionRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "transaction-service",
        url = "http://localhost:8083"
)
public interface TransactionServiceClient {

    @PostMapping("/transactions")
    void createTransaction(
            @RequestBody CreateTransactionRequest request
    );
}