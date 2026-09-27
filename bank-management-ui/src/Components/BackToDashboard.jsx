import { useNavigate } from "react-router-dom";
import "./BackToDashboard.css";

function BackToDashboard() {
    const navigate = useNavigate();

    return (
        <button
            className="back-to-dashboard"
            onClick={() => navigate("/dashboard")}
        >
            ← Back to Dashboard
        </button>
    );
}

export default BackToDashboard;