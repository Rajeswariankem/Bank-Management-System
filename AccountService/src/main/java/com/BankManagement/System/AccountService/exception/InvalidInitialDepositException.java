package com.BankManagement.System.AccountService.exception;

public class InvalidInitialDepositException extends RuntimeException{
    public InvalidInitialDepositException(String message) {
        super(message);
    }
}
