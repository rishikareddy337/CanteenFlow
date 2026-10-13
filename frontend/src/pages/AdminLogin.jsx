import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@canteenflow.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (err) {
      console.error("Admin login failed", err);
      setErrorMsg(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="admin-login-main">
        <div className="auth-card-wrapper">
          <div className="admin-auth-card">
            <div className="auth-icon-badge">🔒</div>
            <h1 className="auth-title">Canteen Staff Portal</h1>
            <p className="auth-subtitle">
              Sign in to manage kitchen orders, update preparation queues, and manage menu items.
            </p>

            {errorMsg && (
              <div className="auth-alert error">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="adminEmail">Staff Email</label>
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@canteenflow.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminPassword">Password</label>
                <input
                  id="adminPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-auth-submit"
              >
                {loading ? "Authenticating Staff..." : "Sign In to Admin Dashboard →"}
              </button>
            </form>

            <div className="auth-demo-hint">
              <strong>🔑 Default Staff Credentials:</strong>
              <p>Email: <code>admin@canteenflow.com</code></p>
              <p>Password: <code>admin123</code></p>
            </div>

            <div className="auth-card-footer">
              <Link to="/">← Return to Student Ordering Portal</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminLogin;
