package com.BankManagement.System.LoanService.client;

import com.BankManagement.System.LoanService.dto.Request.DepositRequest;
import com.BankManagement.System.LoanService.dto.response.AccountResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "account-service",
        url = "http://localhost:8082"
)
public interface AccountServiceClient {

    @GetMapping("/accounts/{accountNumber}")
    AccountResponse getAccount(
            @PathVariable String accountNumber,
            @RequestHeader("Authorization") String authorization
    );

    @PostMapping("/accounts/{accountNumber}/loan-disbursement")
    void loanDisbursement(
            @PathVariable String accountNumber,
            @RequestHeader("Authorization") String authorization,
            @RequestBody DepositRequest request
    );
}