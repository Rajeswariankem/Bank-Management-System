import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const decodeJwt = (token) => {
        try {
            const payload = token.split(".")[1];

            const decodedPayload = JSON.parse(
                atob(
                    payload
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

            return decodedPayload;

        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/authservice/auth/login",
                {
                    username: username.trim(),
                    password
                }
            );

            console.log("Login response:", response.data);

            const {
                token,
                username: loggedInUsername,
                role
            } = response.data;

            if (!token) {
                setError("Login failed. Token not received.");
                return;
            }

            const decodedToken = decodeJwt(token);

            const userId = decodedToken?.userId;

            console.log("Decoded JWT:", decodedToken);
            console.log("User ID:", userId);

            localStorage.setItem("token", token);

            if (userId !== undefined && userId !== null) {
                localStorage.setItem(
                    "userId",
                    String(userId)
                );
            }

            if (loggedInUsername) {
                localStorage.setItem(
                    "username",
                    loggedInUsername
                );
            }

            if (role) {
                localStorage.setItem("role", role);
            }

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid username or password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Bank Management System</h1>

                <h2>Login</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div>

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Enter username"
                            disabled={loading}
                        />

                    </div>

                    <div>

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter password"
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p>
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </p>

            </div>

        </div>
    );
};

export default Login;