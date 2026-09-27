package com.BankManagement.System.TransactionService.controller;

import com.BankManagement.System.TransactionService.dto.request.CreateTransactionRequest;
import com.BankManagement.System.TransactionService.dto.response.TransactionResponse;
import com.BankManagement.System.TransactionService.service.interfaces.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(request));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable String transactionId) {

        return ResponseEntity.ok(
                transactionService.getTransaction(transactionId)
        );
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionService.getTransactionsByAccount(accountNumber)
        );
    }
}