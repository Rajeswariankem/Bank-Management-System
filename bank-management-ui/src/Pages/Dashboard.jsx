import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";
import BackToDashboard from "../components/BackToDashboard";
function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        api.get("/authservice/auth/me")
            .then((response) => {
                console.log("Current user:", response.data);
                setUser(response.data);
            })
            .catch((error) => {

                console.error("Failed to get user:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");

                navigate("/login");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [navigate]);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        navigate("/login");
    };


    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading...
            </div>
        );
    }


    return (
        <div className="dashboard">
            
            <header className="dashboard-header">

                <div>
                    <h1>🏦 Bank Management System</h1>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            <main className="dashboard-content">

                <section className="welcome-section">

                    <h2>
                        Welcome back
                        {user?.username
                            ? `, ${user.username}`
                            : ""}
                    </h2>

                    <p>
                        Manage your banking activities from here.
                    </p>

                </section>


                <section className="dashboard-cards">

                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/accounts")}
                    >
                        <div className="card-icon">💰</div>

                        <h3>Accounts</h3>

                        <p>
                            View and manage your bank accounts.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/loans")}
                    >
                        <div className="card-icon">🏦</div>

                        <h3>Loans</h3>

                        <p>
                            Apply for and manage your loans.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/transactions")}
                    >
                        <div className="card-icon">💳</div>

                        <h3>Transactions</h3>

                        <p>
                            View your transaction history.
                        </p>
                    </div>


                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/notifications")}
                    >
                        <div className="card-icon">🔔</div>

                        <h3>Notifications</h3>

                        <p>
                            View your latest notifications.
                        </p>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
