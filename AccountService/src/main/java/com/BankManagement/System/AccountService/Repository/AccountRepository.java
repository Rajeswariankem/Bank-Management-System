package com.BankManagement.System.AccountService.Repository;

import com.BankManagement.System.AccountService.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomerId(Long customerId);

    boolean existsByAccountNumber(String accountNumber);
}