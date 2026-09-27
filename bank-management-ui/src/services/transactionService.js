import api from "../Api/axios";

export const getTransactionsByAccount = async (accountNumber) => {
    const response = await api.get(
        `/transactionservice/transactions/account/${accountNumber}`
    );

    return response.data;
};

export const getTransaction = async (transactionId) => {
    const response = await api.get(
        `/transactionservice/transactions/${transactionId}`
    );

    return response.data;
};

export const createTransaction = async (transactionData) => {
    const response = await api.post(
        "/transactionservice/transactions",
        transactionData
    );

    return response.data;
};