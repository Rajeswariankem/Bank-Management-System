package com.BankManagement.System.TransactionService.service.impl;

import com.BankManagement.System.TransactionService.dto.request.CreateTransactionRequest;
import com.BankManagement.System.TransactionService.dto.response.TransactionResponse;
import com.BankManagement.System.TransactionService.entity.Transaction;
import com.BankManagement.System.TransactionService.enums.TransactionStatus;
import com.BankManagement.System.TransactionService.enums.TransactionType;
import com.BankManagement.System.TransactionService.exception.TransactionNotFoundException;
import com.BankManagement.System.TransactionService.repository.TransactionRepository;
import com.BankManagement.System.TransactionService.service.interfaces.TransactionService;
import com.BankManagement.System.TransactionService.util.TransactionIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionIdGenerator transactionIdGenerator;

    @Override
    public TransactionResponse createTransaction(
            CreateTransactionRequest request
    ) {

        validateTransaction(request);

        Transaction transaction = Transaction.builder()
                .transactionId(transactionIdGenerator.generate())
                .sourceAccountNumber(normalizeAccountNumber(
                        request.getSourceAccountNumber()
                ))
                .destinationAccountNumber(normalizeAccountNumber(
                        request.getDestinationAccountNumber()
                ))
                .amount(request.getAmount())
                .transactionType(request.getTransactionType())
                .transactionStatus(TransactionStatus.SUCCESS)
                .description(normalizeDescription(
                        request.getDescription()
                ))
                .build();

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return mapToResponse(savedTransaction);
    }

    @Override
    public TransactionResponse getTransaction(
            String transactionId
    ) {

        if (transactionId == null ||
                transactionId.isBlank()) {

            throw new IllegalArgumentException(
                    "Transaction ID is required."
            );
        }

        Transaction transaction =
                transactionRepository
                        .findByTransactionId(transactionId)
                        .orElseThrow(() ->
                                new TransactionNotFoundException(
                                        "Transaction not found: "
                                                + transactionId
                                )
                        );

        return mapToResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByAccount(
            String accountNumber
    ) {

        if (accountNumber == null ||
                accountNumber.isBlank()) {

            throw new IllegalArgumentException(
                    "Account number is required."
            );
        }

        String normalizedAccountNumber =
                accountNumber.trim();

        List<Transaction> transactions =
                transactionRepository
                        .findBySourceAccountNumberOrDestinationAccountNumber(
                                normalizedAccountNumber,
                                normalizedAccountNumber
                        );

        return transactions.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void validateTransaction(
            CreateTransactionRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Transaction request is required."
            );
        }

        if (request.getTransactionType() == null) {
            throw new IllegalArgumentException(
                    "Transaction type is required."
            );
        }

        validateAmount(request.getAmount());

        String sourceAccountNumber =
                normalizeAccountNumber(
                        request.getSourceAccountNumber()
                );

        String destinationAccountNumber =
                normalizeAccountNumber(
                        request.getDestinationAccountNumber()
                );

        TransactionType transactionType =
                request.getTransactionType();

        switch (transactionType) {

            case DEPOSIT:

                requireAccount(
                        destinationAccountNumber,
                        "Destination account is required for deposit."
                );

                break;

            case WITHDRAW:

                requireAccount(
                        sourceAccountNumber,
                        "Source account is required for withdrawal."
                );

                break;

            case TRANSFER:

                requireAccount(
                        sourceAccountNumber,
                        "Source account is required for transfer."
                );

                requireAccount(
                        destinationAccountNumber,
                        "Destination account is required for transfer."
                );

                if (sourceAccountNumber.equals(
                        destinationAccountNumber
                )) {

                    throw new IllegalArgumentException(
                            "Source and destination accounts cannot be the same."
                    );
                }

                break;

            case LOAN_DISBURSEMENT:

                requireAccount(
                        destinationAccountNumber,
                        "Destination account is required for loan disbursement."
                );

                break;

            default:

                throw new IllegalArgumentException(
                        "Unsupported transaction type."
                );
        }
    }

    private void validateAmount(BigDecimal amount) {

        if (amount == null) {
            throw new IllegalArgumentException(
                    "Transaction amount is required."
            );
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Transaction amount must be greater than zero."
            );
        }
    }

    private void requireAccount(
            String accountNumber,
            String errorMessage
    ) {

        if (accountNumber == null ||
                accountNumber.isBlank()) {

            throw new IllegalArgumentException(
                    errorMessage
            );
        }
    }

    private String normalizeAccountNumber(
            String accountNumber
    ) {

        if (accountNumber == null) {
            return null;
        }

        String value = accountNumber.trim();

        return value.isEmpty() ? null : value;
    }

    private String normalizeDescription(
            String description
    ) {

        if (description == null) {
            return null;
        }

        String value = description.trim();

        return value.isEmpty() ? null : value;
    }

    private TransactionResponse mapToResponse(
            Transaction transaction
    ) {

        return TransactionResponse.builder()
                .transactionId(
                        transaction.getTransactionId()
                )
                .sourceAccountNumber(
                        transaction.getSourceAccountNumber()
                )
                .destinationAccountNumber(
                        transaction.getDestinationAccountNumber()
                )
                .amount(
                        transaction.getAmount()
                )
                .transactionType(
                        transaction.getTransactionType()
                )
                .transactionStatus(
                        transaction.getTransactionStatus()
                )
                .description(
                        transaction.getDescription()
                )
                .createdAt(
                        transaction.getCreatedAt()
                )
                .build();
    }
}