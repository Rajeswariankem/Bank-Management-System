import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyAccounts,
    createAccount
} from "../services/accountService";
import AccountCard from "../Components/accounts/AccountCard";
import "./Accounts.css";
import BackToDashboard from "../components/BackToDashboard";

const Accounts = () => {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [accountType, setAccountType] = useState("SAVINGS");
    const [initialDeposit, setInitialDeposit] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyAccounts();

            setAccounts(
                Array.isArray(data) ? data : []
            );

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
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setAccountType("SAVINGS");
        setInitialDeposit("");
        setCreateError("");
        setCreateSuccess("");
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        if (!creating) {
            setShowCreateModal(false);
        }
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();

        setCreateError("");
        setCreateSuccess("");

        if (
            !initialDeposit ||
            Number(initialDeposit) <= 0
        ) {
            setCreateError(
                "Initial deposit must be greater than 0."
            );
            return;
        }

        try {
            setCreating(true);

            const accountData = {
                accountType,
                initialDeposit: Number(initialDeposit)
            };

            await createAccount(accountData);

            setCreateSuccess(
                "Account created successfully."
            );

            await loadAccounts();

            setTimeout(() => {
                setShowCreateModal(false);
                setCreateSuccess("");
            }, 1000);

        } catch (error) {
            console.error(
                "Failed to create account:",
                error
            );

            setCreateError(
                error.response?.data?.message ||
                "Unable to create account."
            );

        } finally {
            setCreating(false);
        }
    };

    const handleViewDetails = (account) => {
        navigate(
            `/accounts/${account.accountNumber}`
        );
    };

    if (loading) {
        return (
            <div className="accounts-page">
                <div className="accounts-loading">
                    Loading accounts...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="accounts-page">
                <div className="accounts-error">
                    <p>{error}</p>

                    <button onClick={loadAccounts}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="accounts-page">
            
                <BackToDashboard />

            

            <div className="accounts-header">

                <div>
                    <h2>My Accounts</h2>

                    <p>
                        View and manage your bank accounts
                    </p>
                </div>

                <button
                    className="create-account-button"
                    onClick={openCreateModal}
                >
                    + Create New Account
                </button>

            </div>

            {accounts.length === 0 ? (

                <div className="accounts-empty">

                    <div className="empty-account-icon">
                        ₹
                    </div>

                    <h3>No Accounts Found</h3>

                    <p>
                        You don't have any bank accounts yet.
                    </p>

                    <button
                        className="create-account-empty-button"
                        onClick={openCreateModal}
                    >
                        Create Your First Account
                    </button>

                </div>

            ) : (

                <div className="accounts-grid">

                    {accounts.map((account) => (

                        <AccountCard
                            key={account.accountNumber}
                            account={account}
                            onSelect={handleViewDetails}
                        />

                    ))}

                </div>
            )}

            {showCreateModal && (

                <div
                    className="account-modal-overlay"
                    onClick={closeCreateModal}
                >

                    <div
                        className="account-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="account-modal-header">

                            <div>
                                <h3>
                                    Create New Account
                                </h3>

                                <p>
                                    Open a new bank account
                                </p>
                            </div>

                            <button
                                className="modal-close-button"
                                onClick={closeCreateModal}
                                disabled={creating}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="create-account-form"
                            onSubmit={handleCreateAccount}
                        >

                            <div className="form-group">

                                <label htmlFor="accountType">
                                    Account Type
                                </label>

                                <select
                                    id="accountType"
                                    value={accountType}
                                    onChange={(event) =>
                                        setAccountType(
                                            event.target.value
                                        )
                                    }
                                    disabled={creating}
                                >

                                    <option value="SAVINGS">
                                        Savings Account
                                    </option>

                                    <option value="CURRENT">
                                        Current Account
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label htmlFor="initialDeposit">
                                    Initial Deposit
                                </label>

                                <div className="amount-input">

                                    <span>₹</span>

                                    <input
                                        id="initialDeposit"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Enter amount"
                                        value={initialDeposit}
                                        onChange={(event) =>
                                            setInitialDeposit(
                                                event.target.value
                                            )
                                        }
                                        disabled={creating}
                                    />

                                </div>

                            </div>

                            {createError && (
                                <div className="create-account-error">
                                    {createError}
                                </div>
                            )}

                            {createSuccess && (
                                <div className="create-account-success">
                                    {createSuccess}
                                </div>
                            )}

                            <div className="create-account-actions">

                                <button
                                    type="button"
                                    className="cancel-account-button"
                                    onClick={closeCreateModal}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-account-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Account"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Accounts;