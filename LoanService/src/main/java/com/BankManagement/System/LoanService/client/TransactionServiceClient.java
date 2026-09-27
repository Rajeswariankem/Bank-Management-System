package com.BankManagement.System.LoanService.client;

import com.BankManagement.System.LoanService.dto.request.CreateTransactionRequest;
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