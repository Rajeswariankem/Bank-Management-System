package com.BankManagement.System.AccountService.Controller;

import com.BankManagement.System.AccountService.Service.Interfaces.AccountService;
import com.BankManagement.System.AccountService.dto.Request.CreateAccountRequest;
import com.BankManagement.System.AccountService.dto.Request.DepositRequest;
import com.BankManagement.System.AccountService.dto.Request.TransferRequest;
import com.BankManagement.System.AccountService.dto.Response.AccountResponse;
import com.BankManagement.System.AccountService.dto.Response.TransactionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.BankManagement.System.AccountService.Security.JwtUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CreateAccountRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accountService.createAccount(token, request));
    }
    @PostMapping("/{accountNumber}/loan-disbursement")
    public ResponseEntity<TransactionResponse> loanDisbursement(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequest request) {

        return ResponseEntity.ok(
                accountService.loanDisbursement(
                        accountNumber,
                        request
                )
        );
    }
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccounts(
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(
                accountService.getMyAccounts(token)
        );
    }
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                accountService.getAccountByAccountNumber(accountNumber)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{accountNumber}/approve")
    public ResponseEntity<AccountResponse> approveAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                accountService.approveAccount(accountNumber)
        );
    }
    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequest request) {

        return ResponseEntity.ok(
                accountService.withdraw(accountNumber, request)
        );
    }
    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequest request) {

        return ResponseEntity.ok(
                accountService.deposit(accountNumber, request)
        );
    }
    @PostMapping("/{accountNumber}/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @PathVariable String accountNumber,
            @Valid @RequestBody TransferRequest request) {

        return ResponseEntity.ok(
                accountService.transfer(accountNumber, request)
        );
    }
}
