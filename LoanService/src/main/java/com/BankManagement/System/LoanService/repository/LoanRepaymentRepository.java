package com.BankManagement.System.LoanService.repository;

import com.BankManagement.System.LoanService.entity.LoanRepayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepaymentRepository
        extends JpaRepository<LoanRepayment, Long> {

    List<LoanRepayment> findByLoanNumber(String loanNumber);

    List<LoanRepayment> findByCustomerId(Long customerId);
}