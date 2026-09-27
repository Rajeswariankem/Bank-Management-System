import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccount } from "../services/accountService";
import "./AccountDetails.css";
import BackToDashboard from "../components/BackToDashboard";

const AccountDetails = () => {

    const { accountNumber } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAccount();
    }, [accountNumber]);

    const loadAccount = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAccount(
                accountNumber
            );

            setAccount(data);

        } catch (error) {

            console.error(
                "Failed to load account:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load account."
            );

        } finally {

            setLoading(false);

        }
    };

    const formatBalance = (balance) => {
        return Number(balance || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    if (loading) {

        return (
            <div className="account-details-page">

                <div className="account-details-loading">
                    Loading account details...
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="account-details-page">

                <div className="account-details-error">

                    <h3>
                        Unable to load account
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/accounts")
                        }
                    >
                        Back to Accounts
                    </button>

                </div>

            </div>
        );
    }

    if (!account) {
        return null;
    }

    return (
        <div className="account-details-page">
           
                <BackToDashboard />

           

            <div className="account-details-container">

                <div className="account-details-header">

                    <div>

                        <button
                            className="account-back-button"
                            onClick={() =>
                                navigate("/accounts")
                            }
                        >
                            ← Back to Accounts
                        </button>

                        <h2>
                            Account Details
                        </h2>

                        <p>
                            View and manage your bank account
                        </p>

                    </div>

                    <span
                        className={`account-details-status ${account.status?.toLowerCase()
                            }`}
                    >
                        {account.status}
                    </span>

                </div>

                <div className="account-details-card">

                    <div className="account-details-card-header">

                        <div className="account-details-icon">
                            ₹
                        </div>

                        <div>

                            <h3>
                                {account.accountType}
                            </h3>

                            <p>
                                Bank Account
                            </p>

                        </div>

                    </div>

                    <div className="account-details-grid">

                        <div className="account-detail-item">

                            <span>
                                Account Number
                            </span>

                            <strong>
                                {account.accountNumber}
                            </strong>

                        </div>

                        <div className="account-detail-item">

                            <span>
                                Account Type
                            </span>

                            <strong>
                                {account.accountType}
                            </strong>

                        </div>

                        <div className="account-detail-item">

                            <span>
                                Available Balance
                            </span>

                            <strong className="account-detail-balance">
                                ₹{formatBalance(
                                    account.balance
                                )}
                            </strong>

                        </div>

                        <div className="account-detail-item">

                            <span>
                                Status
                            </span>

                            <strong>
                                {account.status}
                            </strong>

                        </div>

                        {account.createdAt && (

                            <div className="account-detail-item">

                                <span>
                                    Created At
                                </span>

                                <strong>
                                    {new Date(
                                        account.createdAt
                                    ).toLocaleString()}
                                </strong>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AccountDetails;