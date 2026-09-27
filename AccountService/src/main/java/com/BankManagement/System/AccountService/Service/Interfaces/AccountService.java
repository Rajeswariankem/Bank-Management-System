package com.BankManagement.System.AccountService.Service.Interfaces;

import com.BankManagement.System.AccountService.client.TransactionServiceClient;
import com.BankManagement.System.AccountService.dto.Request.CreateAccountRequest;
import com.BankManagement.System.AccountService.dto.Request.DepositRequest;
import com.BankManagement.System.AccountService.dto.Request.TransferRequest;
import com.BankManagement.System.AccountService.dto.Response.AccountResponse;
import com.BankManagement.System.AccountService.dto.Response.TransactionResponse;
import com.BankManagement.System.AccountService.entity.Account;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(
            String token,
            CreateAccountRequest request
    );
    AccountResponse getAccountByAccountNumber(String accountNumber);
    AccountResponse approveAccount(String accountNumber);
    TransactionResponse deposit(
            String accountNumber,
            DepositRequest request);
    TransactionResponse withdraw(
            String accountNumber,
            DepositRequest request
    );
    TransactionResponse transfer(
            String sourceAccountNumber,
            TransferRequest request);
    TransactionResponse loanDisbursement(
            String accountNumber,
            DepositRequest request
    );
    List<AccountResponse> getMyAccounts(String token);

}
