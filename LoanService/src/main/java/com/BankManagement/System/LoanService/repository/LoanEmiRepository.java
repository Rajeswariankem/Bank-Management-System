package com.BankManagement.System.LoanService.repository;

import com.BankManagement.System.LoanService.entity.LoanEmi;
import com.BankManagement.System.LoanService.enums.EmiStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanEmiRepository extends JpaRepository<LoanEmi, Long> {

    List<LoanEmi> findByLoanNumberOrderByInstallmentNumberAsc(
            String loanNumber
    );

    Optional<LoanEmi> findByEmiNumber(String emiNumber);

    List<LoanEmi> findByStatus(EmiStatus status);
}