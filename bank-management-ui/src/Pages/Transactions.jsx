import { useEffect, useState } from "react";
import {
    getMyAccounts
} from "../services/accountService";
import {
    getTransactionsByAccount,
    createTransaction,
    getTransaction
} from "../services/transactionService";
import TransactionCard from "../Components/transactions/TransactionCard";
import "./Transactions.css";
import BackToDashboard from "../components/BackToDashboard";
const Transactions = () => {

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");

    const [transactions, setTransactions] = useState([]);

    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [selectedTransaction, setSelectedTransaction] =
        useState(null);

    const [loadingTransactionDetails, setLoadingTransactionDetails] =
        useState(false);

    const [transactionDetailsError, setTransactionDetailsError] =
        useState("");

    const [formData, setFormData] = useState({
        transactionType: "DEPOSIT",
        sourceAccountNumber: "",
        destinationAccountNumber: "",
        amount: "",
        description: ""
    });

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoadingAccounts(true);
            setError("");

            const data = await getMyAccounts();

            const accountList = Array.isArray(data)
                ? data
                : [];

            setAccounts(accountList);

            if (accountList.length > 0) {

                setSelectedAccount(
                    accountList[0].accountNumber
                );

                setFormData((previous) => ({
                    ...previous,
                    sourceAccountNumber:
                        accountList[0].accountNumber
                }));
            }

        } catch (error) {

            console.error(
                "Failed to load accounts:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load accounts."
            );

        } finally {
            setLoadingAccounts(false);
        }
    };

    useEffect(() => {

        if (!selectedAccount) {
            setTransactions([]);
            return;
        }

        loadTransactions(selectedAccount);

    }, [selectedAccount]);

    const loadTransactions = async (accountNumber) => {

        try {

            setLoadingTransactions(true);
            setError("");

            const data =
                await getTransactionsByAccount(
                    accountNumber
                );

            setTransactions(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Failed to load transactions:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load transactions."
            );

            setTransactions([]);

        } finally {
            setLoadingTransactions(false);
        }
    };

    const handleAccountChange = (event) => {

        const accountNumber = event.target.value;

        setSelectedAccount(accountNumber);

        setFormData((previous) => ({
            ...previous,
            sourceAccountNumber: accountNumber
        }));
    };

    const handleRefresh = () => {

        if (selectedAccount) {
            loadTransactions(selectedAccount);
        }
    };

    const openModal = () => {

        setFormData({
            transactionType: "DEPOSIT",
            sourceAccountNumber:
                selectedAccount || "",
            destinationAccountNumber: "",
            amount: "",
            description: ""
        });

        setFormError("");
        setSuccessMessage("");
        setShowModal(true);
    };

    const closeModal = () => {

        if (submitting) {
            return;
        }

        setShowModal(false);
        setFormError("");
        setSuccessMessage("");
    };

    const handleFormChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleTransactionTypeChange = (event) => {

        const transactionType = event.target.value;

        setFormData((previous) => ({
            ...previous,
            transactionType,
            destinationAccountNumber:
                transactionType === "TRANSFER"
                    ? previous.destinationAccountNumber
                    : ""
        }));

        setFormError("");
    };

    const handleSubmitTransaction = async (event) => {

        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        const amount = Number(formData.amount);

        if (!formData.sourceAccountNumber) {
            setFormError(
                "Please select a source account."
            );
            return;
        }

        if (!formData.amount || amount <= 0) {
            setFormError(
                "Transaction amount must be greater than ₹0."
            );
            return;
        }

        if (
            formData.transactionType === "TRANSFER" &&
            !formData.destinationAccountNumber.trim()
        ) {
            setFormError(
                "Destination account number is required."
            );
            return;
        }

        if (
            formData.transactionType === "TRANSFER" &&
            formData.sourceAccountNumber ===
                formData.destinationAccountNumber.trim()
        ) {
            setFormError(
                "Source and destination accounts cannot be the same."
            );
            return;
        }

        try {

            setSubmitting(true);

            const requestData = {
                sourceAccountNumber:
                    formData.sourceAccountNumber,

                destinationAccountNumber:
                    formData.transactionType === "TRANSFER"
                        ? formData.destinationAccountNumber.trim()
                        : null,

                amount,

                transactionType:
                    formData.transactionType,

                description:
                    formData.description.trim() || null
            };

            const newTransaction =
                await createTransaction(requestData);

            if (
                newTransaction &&
                newTransaction.transactionId
            ) {

                setTransactions((previous) => [
                    newTransaction,
                    ...previous
                ]);

            } else {

                await loadTransactions(
                    selectedAccount
                );
            }

            setSuccessMessage(
                "Transaction created successfully."
            );

            setFormData({
                transactionType: "DEPOSIT",
                sourceAccountNumber:
                    selectedAccount || "",
                destinationAccountNumber: "",
                amount: "",
                description: ""
            });

            setTimeout(() => {
                setShowModal(false);
                setSuccessMessage("");
            }, 1200);

        } catch (error) {

            console.error(
                "Failed to create transaction:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to create transaction."
            );

        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectTransaction = async (transaction) => {

        setSelectedTransaction(null);
        setTransactionDetailsError("");
        setLoadingTransactionDetails(true);

        try {

            const data =
                await getTransaction(
                    transaction.transactionId
                );

            setSelectedTransaction(data);

        } catch (error) {

            console.error(
                "Failed to load transaction details:",
                error
            );

            setTransactionDetailsError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load transaction details."
            );

        } finally {
            setLoadingTransactionDetails(false);
        }
    };

    const closeTransactionDetails = () => {

        setSelectedTransaction(null);
        setTransactionDetailsError("");
    };

    const formatAmount = (amount) => {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(amount);
    };

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const getTypeLabel = (type) => {

        switch (type) {

            case "DEPOSIT":
                return "Deposit";

            case "WITHDRAW":
                return "Withdrawal";

            case "TRANSFER":
                return "Transfer";

            case "LOAN_DISBURSEMENT":
                return "Loan Disbursement";

            default:
                return type || "Transaction";
        }
    };

    if (loadingAccounts) {

        return (
            <div className="transactions-page">

                <div className="transactions-loading">
                    Loading accounts...
                </div>

            </div>
        );
    }

    return (
        <div className="transactions-page">
            
                <BackToDashboard />

            

            <div className="transactions-header">

                <div>
                    <h2>Transactions</h2>

                    <p>
                        View and manage your account transactions
                    </p>
                </div>

                <div className="transactions-header-actions">

                    {accounts.length > 0 && (
                        <button
                            className="new-transaction-button"
                            onClick={openModal}
                        >
                            + New Transaction
                        </button>
                    )}

                    {accounts.length > 0 && (
                        <button
                            className="refresh-transactions-button"
                            onClick={handleRefresh}
                            disabled={loadingTransactions}
                        >
                            {loadingTransactions
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>
                    )}

                </div>

            </div>

            {accounts.length === 0 ? (

                <div className="transactions-empty">

                    <div className="empty-transaction-icon">
                        ₹
                    </div>

                    <h3>No Accounts Found</h3>

                    <p>
                        Create a bank account first to view
                        your transactions.
                    </p>

                </div>

            ) : (

                <>

                    <div className="transaction-account-selector">

                        <label htmlFor="transactionAccount">
                            Select Account
                        </label>

                        <select
                            id="transactionAccount"
                            value={selectedAccount}
                            onChange={handleAccountChange}
                        >

                            {accounts.map((account) => (
                                <option
                                    key={account.accountNumber}
                                    value={account.accountNumber}
                                >
                                    {account.accountNumber}
                                    {" - "}
                                    {account.accountType}
                                </option>
                            ))}

                        </select>

                    </div>

                    {error ? (

                        <div className="transactions-error">

                            <p>{error}</p>

                            <button
                                onClick={handleRefresh}
                            >
                                Retry
                            </button>

                        </div>

                    ) : loadingTransactions ? (

                        <div className="transactions-loading">
                            Loading transactions...
                        </div>

                    ) : transactions.length === 0 ? (

                        <div className="transactions-empty">

                            <div className="empty-transaction-icon">
                                ₹
                            </div>

                            <h3>No Transactions Found</h3>

                            <p>
                                There are no transactions for
                                this account yet.
                            </p>

                            <button
                                className="empty-new-transaction-button"
                                onClick={openModal}
                            >
                                Create New Transaction
                            </button>

                        </div>

                    ) : (

                        <div className="transactions-grid">

                            {transactions.map(
                                (transaction) => (

                                    <TransactionCard
                                        key={
                                            transaction.transactionId
                                        }
                                        transaction={transaction}
                                        onSelect={
                                            handleSelectTransaction
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </>
            )}

            {showModal && (

                <div
                    className="transaction-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                                event.currentTarget &&
                            !submitting
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="transaction-modal">

                        <div className="transaction-modal-header">

                            <div>
                                <h3>
                                    New Transaction
                                </h3>

                                <p>
                                    Create a new banking transaction
                                </p>
                            </div>

                            <button
                                className="transaction-modal-close"
                                onClick={closeModal}
                                disabled={submitting}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="transaction-form"
                            onSubmit={
                                handleSubmitTransaction
                            }
                        >

                            <div className="transaction-form-group">

                                <label htmlFor="transactionType">
                                    Transaction Type
                                </label>

                                <select
                                    id="transactionType"
                                    name="transactionType"
                                    value={
                                        formData.transactionType
                                    }
                                    onChange={
                                        handleTransactionTypeChange
                                    }
                                    disabled={submitting}
                                >

                                    <option value="DEPOSIT">
                                        Deposit
                                    </option>

                                    <option value="WITHDRAW">
                                        Withdraw
                                    </option>

                                    <option value="TRANSFER">
                                        Transfer
                                    </option>

                                    <option value="LOAN_DISBURSEMENT">
                                        Loan Disbursement
                                    </option>

                                </select>

                            </div>

                            <div className="transaction-form-group">

                                <label htmlFor="sourceAccountNumber">
                                    Source Account
                                </label>

                                <select
                                    id="sourceAccountNumber"
                                    name="sourceAccountNumber"
                                    value={
                                        formData.sourceAccountNumber
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    disabled={submitting}
                                >

                                    <option value="">
                                        Select account
                                    </option>

                                    {accounts.map((account) => (
                                        <option
                                            key={
                                                account.accountNumber
                                            }
                                            value={
                                                account.accountNumber
                                            }
                                        >
                                            {
                                                account.accountNumber
                                            }
                                            {" - "}
                                            {
                                                account.accountType
                                            }
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {formData.transactionType ===
                                "TRANSFER" && (

                                <div className="transaction-form-group">

                                    <label htmlFor="destinationAccountNumber">
                                        Destination Account
                                    </label>

                                    <input
                                        id="destinationAccountNumber"
                                        name="destinationAccountNumber"
                                        type="text"
                                        value={
                                            formData.destinationAccountNumber
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Enter destination account number"
                                        disabled={submitting}
                                    />

                                </div>

                            )}

                            <div className="transaction-form-group">

                                <label htmlFor="amount">
                                    Amount
                                </label>

                                <div className="transaction-amount-input">

                                    <span>₹</span>

                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={
                                            formData.amount
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Enter amount"
                                        disabled={submitting}
                                    />

                                </div>

                            </div>

                            <div className="transaction-form-group">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Enter transaction description"
                                    rows="3"
                                    disabled={submitting}
                                />

                            </div>

                            {formError && (

                                <div className="transaction-form-error">
                                    {formError}
                                </div>

                            )}

                            {successMessage && (

                                <div className="transaction-form-success">
                                    {successMessage}
                                </div>

                            )}

                            <div className="transaction-form-actions">

                                <button
                                    type="button"
                                    className="cancel-transaction-button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-transaction-button"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Processing..."
                                        : "Create Transaction"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {(
                selectedTransaction ||
                loadingTransactionDetails ||
                transactionDetailsError
            ) && (

                <div
                    className="transaction-details-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                                event.currentTarget &&
                            !loadingTransactionDetails
                        ) {
                            closeTransactionDetails();
                        }

                    }}
                >

                    <div className="transaction-details-modal">

                        <div className="transaction-details-header">

                            <div>
                                <h3>
                                    Transaction Details
                                </h3>

                                <p>
                                    Complete transaction information
                                </p>
                            </div>

                            <button
                                className="transaction-details-close"
                                onClick={
                                    closeTransactionDetails
                                }
                                disabled={
                                    loadingTransactionDetails
                                }
                            >
                                ×
                            </button>

                        </div>

                        {loadingTransactionDetails ? (

                            <div className="transaction-details-loading">
                                Loading transaction details...
                            </div>

                        ) : transactionDetailsError ? (

                            <div className="transaction-details-error">
                                <p>
                                    {transactionDetailsError}
                                </p>

                                <button
                                    onClick={
                                        closeTransactionDetails
                                    }
                                >
                                    Close
                                </button>
                            </div>

                        ) : selectedTransaction ? (

                            <div className="transaction-details-body">

                                <div className="transaction-detail-id">

                                    <span>
                                        Transaction ID
                                    </span>

                                    <strong>
                                        {
                                            selectedTransaction.transactionId
                                        }
                                    </strong>

                                </div>

                                <div className="transaction-detail-grid">

                                    <div>
                                        <span>
                                            Transaction Type
                                        </span>

                                        <strong>
                                            {
                                                getTypeLabel(
                                                    selectedTransaction.transactionType
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Status
                                        </span>

                                        <strong
                                            className={`details-status details-status-${(
                                                selectedTransaction.transactionStatus ||
                                                ""
                                            ).toLowerCase()}`}
                                        >
                                            {
                                                selectedTransaction.transactionStatus
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Amount
                                        </span>

                                        <strong className="details-amount">
                                            {
                                                formatAmount(
                                                    selectedTransaction.amount
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Created At
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedTransaction.createdAt
                                                )
                                            }
                                        </strong>
                                    </div>

                                </div>

                                <div className="transaction-account-details">

                                    <div>

                                        <span>
                                            Source Account
                                        </span>

                                        <strong>
                                            {
                                                selectedTransaction.sourceAccountNumber ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Destination Account
                                        </span>

                                        <strong>
                                            {
                                                selectedTransaction.destinationAccountNumber ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>

                                </div>

                                <div className="transaction-detail-description">

                                    <span>
                                        Description
                                    </span>

                                    <p>
                                        {
                                            selectedTransaction.description ||
                                            "No description provided."
                                        }
                                    </p>

                                </div>

                                <div className="transaction-details-actions">

                                    <button
                                        onClick={
                                            closeTransactionDetails
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        ) : null}

                    </div>

                </div>

            )}

        </div>
    );
};

export default Transactions;