package com.BankManagement.System.LoanService.repository;

import com.BankManagement.System.LoanService.entity.Loan;
import com.BankManagement.System.LoanService.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    Optional<Loan> findByLoanNumber(String loanNumber);

    List<Loan> findByCustomerId(Long customerId);

    List<Loan> findByStatus(LoanStatus status);

    boolean existsByLoanNumber(String loanNumber);
}
