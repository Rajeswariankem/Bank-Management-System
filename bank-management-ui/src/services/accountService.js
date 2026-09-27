import api from "../Api/axios";

export const getMyAccounts = async () => {
    const response = await api.get(
        "/accountservice/accounts"
    );

    return response.data;
};

export const getAccount = async (accountNumber) => {
    const response = await api.get(
        `/accountservice/accounts/${accountNumber}`
    );

    return response.data;
};

export const createAccount = async (accountData) => {
    const response = await api.post(
        "/accountservice/accounts",
        accountData
    );

    return response.data;
};

export const depositMoney = async (
    accountNumber,
    depositData
) => {
    const response = await api.post(
        `/accountservice/accounts/${accountNumber}/deposit`,
        depositData
    );

    return response.data;
};

export const withdrawMoney = async (
    accountNumber,
    withdrawData
) => {
    const response = await api.post(
        `/accountservice/accounts/${accountNumber}/withdraw`,
        withdrawData
    );

    return response.data;
};

export const transferMoney = async (
    accountNumber,
    transferData
) => {
    const response = await api.post(
        `/accountservice/accounts/${accountNumber}/transfer`,
        transferData
    );

    return response.data;
};

export const approveAccount = async (
    accountNumber
) => {
    const response = await api.put(
        `/accountservice/accounts/${accountNumber}/approve`
    );

    return response.data;
};

export const loanDisbursement = async (
    accountNumber,
    disbursementData
) => {
    const response = await api.post(
        `/accountservice/accounts/${accountNumber}/loan-disbursement`,
        disbursementData
    );

    return response.data;
};