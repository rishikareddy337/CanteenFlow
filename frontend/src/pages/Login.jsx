import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      await loginCustomer(email, password);
      navigate("/menu");
    } catch (err) {
      console.warn("API login failed, checking local fallback", err);
      // Fallback check in localStorage
      const users = JSON.parse(localStorage.getItem("canteenUsers") || "[]");
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(
        (u) => u.email === normalizedEmail && u.password === password
      );
      if (user) {
        navigate("/menu");
      } else {
        setErrorMsg(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <Link to="/" className="back-link">
            ← Home
          </Link>

          <h1>Welcome Back! 👋</h1>
          <p className="auth-subtitle">Login to your CanteenFlow student account</p>

          {errorMsg && (
            <div className="auth-alert error">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="student@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          <p className="auth-staff-link">
            Canteen Staff? <Link to="/admin/login">Admin Staff Login →</Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
