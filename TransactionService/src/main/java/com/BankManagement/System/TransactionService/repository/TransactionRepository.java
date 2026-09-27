package com.BankManagement.System.TransactionService.repository;

import com.BankManagement.System.TransactionService.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(
            String transactionId
    );

    List<Transaction> findBySourceAccountNumberOrDestinationAccountNumber(
            String sourceAccountNumber,
            String destinationAccountNumber
    );

    List<Transaction> findByDestinationAccountNumber(
            String accountNumber
    );
}