import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import Transactions from "./pages/Transactions";
import AccountDetails from "./Pages/AccountDetails";
import Notifications from "./pages/Notifications";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/loans"
          element={<Loans />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/accounts"
          element={<Accounts />}
        />
        <Route
          path="/loans/:loanNumber"
          element={<LoanDetails />}
        />
        <Route
          path="/accounts/:accountNumber"
          element={<AccountDetails />}
        />
        <Route path="/transactions" element={<Transactions />} />
        <Route
          path="/notifications"
          element={<Notifications />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;