package com.BankManagement.System.AccountService.Service.Impl;

import com.BankManagement.System.AccountService.client.AuthServiceClient;
import com.BankManagement.System.AccountService.client.TransactionServiceClient;
import com.BankManagement.System.AccountService.dto.Request.CreateTransactionRequest;
import com.BankManagement.System.AccountService.dto.Request.DepositRequest;
import com.BankManagement.System.AccountService.dto.Request.TransferRequest;
import com.BankManagement.System.AccountService.dto.Response.TransactionResponse;
import com.BankManagement.System.AccountService.dto.Response.UserResponse;
import com.BankManagement.System.AccountService.entity.Account;
import com.BankManagement.System.AccountService.Repository.AccountRepository;
import com.BankManagement.System.AccountService.Service.Interfaces.AccountService;
import com.BankManagement.System.AccountService.dto.Request.CreateAccountRequest;
import com.BankManagement.System.AccountService.dto.Response.AccountResponse;
import com.BankManagement.System.AccountService.enums.AccountStatus;
import com.BankManagement.System.AccountService.enums.TransactionType;
import com.BankManagement.System.AccountService.exception.*;
import com.BankManagement.System.AccountService.util.AccountNumberGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountNumberGenerator accountNumberGenerator;
    private final AuthServiceClient authServiceClient;
    private final TransactionServiceClient transactionServiceClient;
    @Override
    public AccountResponse createAccount(
            String token,
            CreateAccountRequest request
    ) {
        if (request.getInitialDeposit().compareTo(
                request.getAccountType().getMinimumBalance()) < 0) {

            throw new InvalidInitialDepositException(
                    "Minimum opening balance for "
                            + request.getAccountType()
                            + " account is "
                            + request.getAccountType().getMinimumBalance());
        }
        String accountNumber = accountNumberGenerator.generate();
        if (accountRepository.existsByAccountNumber(accountNumber)) {
            throw new AccountAlreadyExistsException(
                    "Generated account number already exists. Please try again.");
        }
        UserResponse user = authServiceClient.getCurrentUser(token);

        Long customerId = user.id();
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customerId(customerId)
                .accountType(request.getAccountType())
                .balance(request.getInitialDeposit())
                .status(AccountStatus.PENDING)
                .build();
        Account savedAccount = accountRepository.save(account);
        return AccountResponse.builder()
                .accountNumber(savedAccount.getAccountNumber())
                .customerId(savedAccount.getCustomerId())
                .accountType(savedAccount.getAccountType())
                .status(savedAccount.getStatus())
                .balance(savedAccount.getBalance())
                .createdAt(savedAccount.getCreatedAt())
                .build();
    }
    @Override
    public AccountResponse getAccountByAccountNumber(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found with number: " + accountNumber));

        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .customerId(account.getCustomerId())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .build();
    }
    private Account getActiveAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found with number: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidAccountStateException(
                    "Account is not active.");
        }

        return account;
    }
    @Transactional
    @Override
    public TransactionResponse withdraw(
            String accountNumber,
            DepositRequest request) {

        Account account = getActiveAccount(accountNumber);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance."
            );
        }

        account.setBalance(
                account.getBalance().subtract(request.getAmount())
        );

        Account savedAccount = accountRepository.save(account);

        recordTransaction(
                savedAccount.getAccountNumber(),
                savedAccount.getAccountNumber(),
                request.getAmount(),
                TransactionType.WITHDRAW,
                "Cash Withdrawal"
        );

        return TransactionResponse.builder()
                .accountNumber(savedAccount.getAccountNumber())
                .balance(savedAccount.getBalance())
                .message("Withdrawal successful")
                .build();
    }
    @Transactional
    @Override
    public TransactionResponse transfer(
            String sourceAccountNumber,
            TransferRequest request) {

        Account sourceAccount = getActiveAccount(sourceAccountNumber);

        Account destinationAccount = accountRepository
                .findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Destination account not found."));

        if (destinationAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidAccountStateException(
                    "Destination account is not active.");
        }

        if (sourceAccount.getAccountNumber()
                .equals(destinationAccount.getAccountNumber())) {

            throw new IllegalArgumentException(
                    "Cannot transfer to the same account.");
        }

        if (sourceAccount.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance.");
        }

        sourceAccount.setBalance(
                sourceAccount.getBalance().subtract(request.getAmount())
        );

        destinationAccount.setBalance(
                destinationAccount.getBalance().add(request.getAmount())
        );

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        recordTransaction(
                sourceAccount.getAccountNumber(),
                destinationAccount.getAccountNumber(),
                request.getAmount(),
                TransactionType.TRANSFER,
                "Account Transfer"
        );

        return TransactionResponse.builder()
                .accountNumber(sourceAccount.getAccountNumber())
                .balance(sourceAccount.getBalance())
                .message("Transfer completed successfully.")
                .build();
    }
    @Transactional
    @Override
    public TransactionResponse deposit(
            String accountNumber,
            DepositRequest request) {

        Account account = getActiveAccount(accountNumber);

        account.setBalance(
                account.getBalance().add(request.getAmount())
        );

        Account savedAccount = accountRepository.save(account);

        recordTransaction(
                savedAccount.getAccountNumber(),
                savedAccount.getAccountNumber(),
                request.getAmount(),
                TransactionType.DEPOSIT,
                "Cash Deposit"
        );

        return TransactionResponse.builder()
                .accountNumber(savedAccount.getAccountNumber())
                .balance(savedAccount.getBalance())
                .message("Deposit successful")
                .build();
    }
    @Override
    public AccountResponse approveAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found with number: " + accountNumber));

        if (account.getStatus() == AccountStatus.ACTIVE) {
            throw new InvalidAccountStateException(
                    "Account is already approved.");
        }

        account.setStatus(AccountStatus.ACTIVE);

        Account savedAccount = accountRepository.save(account);

        return AccountResponse.builder()
                .accountNumber(savedAccount.getAccountNumber())
                .customerId(savedAccount.getCustomerId())
                .accountType(savedAccount.getAccountType())
                .status(savedAccount.getStatus())
                .balance(savedAccount.getBalance())
                .createdAt(savedAccount.getCreatedAt())
                .build();
    }
    private void recordTransaction(
            String sourceAccount,
            String destinationAccount,
            BigDecimal amount,
            TransactionType transactionType,
            String description) {

        transactionServiceClient.createTransaction(
                CreateTransactionRequest.builder()
                        .sourceAccountNumber(sourceAccount)
                        .destinationAccountNumber(destinationAccount)
                        .amount(amount)
                        .transactionType(transactionType)
                        .description(description)
                        .build()
        );
    }
    @Override
    @Transactional
    public TransactionResponse loanDisbursement(
            String accountNumber,
            DepositRequest request) {

        Account account = getActiveAccount(accountNumber);

        account.setBalance(
                account.getBalance().add(request.getAmount())
        );

        Account savedAccount = accountRepository.save(account);

        transactionServiceClient.createTransaction(
                CreateTransactionRequest.builder()
                        .destinationAccountNumber(
                                savedAccount.getAccountNumber()
                        )
                        .amount(request.getAmount())
                        .transactionType(
                                TransactionType.LOAN_DISBURSEMENT
                        )
                        .description(
                                "Loan disbursement"
                        )
                        .build()
        );

        return TransactionResponse.builder()
                .accountNumber(savedAccount.getAccountNumber())
                .balance(savedAccount.getBalance())
                .message("Loan disbursement successful")
                .build();
    }
    @Override
    public List<AccountResponse> getMyAccounts(String token) {

        UserResponse user = authServiceClient.getCurrentUser(token);

        Long customerId = user.id();

        List<Account> accounts =
                accountRepository.findByCustomerId(customerId);

        return accounts.stream()
                .map(account -> AccountResponse.builder()
                        .accountNumber(account.getAccountNumber())
                        .customerId(account.getCustomerId())
                        .accountType(account.getAccountType())
                        .status(account.getStatus())
                        .balance(account.getBalance())
                        .createdAt(account.getCreatedAt())
                        .build())
                .toList();
    }
}