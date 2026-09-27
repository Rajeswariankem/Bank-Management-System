package com.BankManagement.System.TransactionService.service.interfaces;

import com.BankManagement.System.TransactionService.dto.request.CreateTransactionRequest;
import com.BankManagement.System.TransactionService.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {

    TransactionResponse createTransaction(CreateTransactionRequest request);

    TransactionResponse getTransaction(String transactionId);

    List<TransactionResponse> getTransactionsByAccount(String accountNumber);
}