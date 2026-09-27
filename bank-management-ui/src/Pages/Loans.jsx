import { useEffect, useState } from "react";
import LoanCard from "../components/LoanCard";
import LoanDetailsModal from "../components/LoanDetailsModal";
import {
    applyForLoan,
    getMyLoans
} from "../services/loanService";
import "./Loans.css";
import BackToDashboard from "../components/BackToDashboard";
const Loans = () => {

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        accountNumber: "",
        loanType: "PERSONAL",
        loanAmount: "",
        tenureMonths: ""
    });

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyLoans();

            setLoans(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Failed to load loans:", error);

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load loans."
            );

        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {

        setFormData({
            accountNumber: "",
            loanType: "PERSONAL",
            loanAmount: "",
            tenureMonths: ""
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

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        const accountNumber = formData.accountNumber.trim();
        const loanAmount = Number(formData.loanAmount);
        const tenureMonths = Number(formData.tenureMonths);

        if (!accountNumber) {
            setFormError("Account number is required.");
            return;
        }

        if (!formData.loanAmount || loanAmount < 1000) {
            setFormError("Loan amount must be at least ₹1,000.");
            return;
        }

        if (!formData.tenureMonths || tenureMonths < 6) {
            setFormError("Loan tenure must be at least 6 months.");
            return;
        }

        try {

            setSubmitting(true);

            const requestData = {
                accountNumber,
                loanType: formData.loanType,
                loanAmount,
                tenureMonths
            };

            const newLoan = await applyForLoan(requestData);

            setLoans((previous) => [
                newLoan,
                ...previous
            ]);

            setSuccessMessage(
                "Loan application submitted successfully."
            );

            setFormData({
                accountNumber: "",
                loanType: "PERSONAL",
                loanAmount: "",
                tenureMonths: ""
            });

            setTimeout(() => {
                setShowModal(false);
                setSuccessMessage("");
            }, 1200);

        } catch (error) {

            console.error(
                "Failed to apply for loan:",
                error
            );

            setFormError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to submit loan application."
            );

        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectLoan = (loan) => {
        setSelectedLoan(loan);
    };

    const closeLoanDetails = () => {
        setSelectedLoan(null);
    };

    if (loading) {

        return (
            <div className="loans-page">

                <div className="loans-loading">
                    Loading loans...
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="loans-page">

                <div className="loans-error">

                    <p>{error}</p>

                    <button onClick={loadLoans}>
                        Retry
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="loans-page">
            
                <BackToDashboard />

            

            <div className="loans-header">

                <div>
                    <h2>My Loans</h2>

                    <p>
                        View and manage your loan applications
                    </p>
                </div>

                <button
                    className="apply-loan-button"
                    onClick={openModal}
                >
                    + Apply for Loan
                </button>

            </div>

            {loans.length === 0 ? (

                <div className="loans-empty">

                    <div className="empty-loan-icon">
                        ₹
                    </div>

                    <h3>No Loans Found</h3>

                    <p>
                        You don't have any loan applications yet.
                    </p>

                    <button
                        className="apply-loan-empty-button"
                        onClick={openModal}
                    >
                        Apply for a Loan
                    </button>

                </div>

            ) : (

                <div className="loans-grid">

                    {loans.map((loan) => (

                        <LoanCard
                            key={loan.loanNumber}
                            loan={loan}
                            onSelect={handleSelectLoan}
                        />

                    ))}

                </div>

            )}

            {showModal && (

                <div
                    className="loan-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target === event.currentTarget &&
                            !submitting
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="loan-modal">

                        <div className="loan-modal-header">

                            <div>
                                <h3>
                                    Apply for a Loan
                                </h3>

                                <p>
                                    Submit your loan application
                                </p>
                            </div>

                            <button
                                className="loan-modal-close"
                                onClick={closeModal}
                                disabled={submitting}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="apply-loan-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="loan-form-group">

                                <label htmlFor="accountNumber">
                                    Account Number
                                </label>

                                <input
                                    id="accountNumber"
                                    name="accountNumber"
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your account number"
                                    disabled={submitting}
                                />

                            </div>

                            <div className="loan-form-group">

                                <label htmlFor="loanType">
                                    Loan Type
                                </label>

                                <select
                                    id="loanType"
                                    name="loanType"
                                    value={formData.loanType}
                                    onChange={handleChange}
                                    disabled={submitting}
                                >

                                    <option value="PERSONAL">
                                        Personal Loan
                                    </option>

                                    <option value="HOME">
                                        Home Loan
                                    </option>

                                    <option value="CAR">
                                        Car Loan
                                    </option>

                                    <option value="EDUCATION">
                                        Education Loan
                                    </option>

                                    <option value="BUSINESS">
                                        Business Loan
                                    </option>

                                </select>

                            </div>

                            <div className="loan-form-group">

                                <label htmlFor="loanAmount">
                                    Loan Amount
                                </label>

                                <div className="loan-amount-input">

                                    <span>₹</span>

                                    <input
                                        id="loanAmount"
                                        name="loanAmount"
                                        type="number"
                                        min="1000"
                                        step="0.01"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                        placeholder="Enter loan amount"
                                        disabled={submitting}
                                    />

                                </div>

                                <small>
                                    Minimum loan amount: ₹1,000
                                </small>

                            </div>

                            <div className="loan-form-group">

                                <label htmlFor="tenureMonths">
                                    Tenure
                                </label>

                                <div className="loan-tenure-input">

                                    <input
                                        id="tenureMonths"
                                        name="tenureMonths"
                                        type="number"
                                        min="6"
                                        value={formData.tenureMonths}
                                        onChange={handleChange}
                                        placeholder="Enter tenure"
                                        disabled={submitting}
                                    />

                                    <span>
                                        months
                                    </span>

                                </div>

                                <small>
                                    Minimum tenure: 6 months
                                </small>

                            </div>

                            {formError && (

                                <div className="loan-form-error">
                                    {formError}
                                </div>

                            )}

                            {successMessage && (

                                <div className="loan-form-success">
                                    {successMessage}
                                </div>

                            )}

                            <div className="loan-form-actions">

                                <button
                                    type="button"
                                    className="cancel-loan-button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-loan-button"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Apply for Loan"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {selectedLoan && (

                <LoanDetailsModal
                    loan={selectedLoan}
                    onClose={closeLoanDetails}
                />

            )}

        </div>
    );
};

export default Loans;