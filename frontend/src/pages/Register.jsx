import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "./Auth.css";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      await api.customerRegister({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone.trim(),
      });

      // Save locally as well
      const users = JSON.parse(localStorage.getItem("canteenUsers") || "[]");
      users.push({ name: name.trim(), email: email.trim().toLowerCase(), password });
      localStorage.setItem("canteenUsers", JSON.stringify(users));

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.warn("API registration failed, storing locally", err);
      const users = JSON.parse(localStorage.getItem("canteenUsers") || "[]");
      const normalizedEmail = email.trim().toLowerCase();
      if (users.some((u) => u.email === normalizedEmail)) {
        setErrorMsg("An account with this email already exists.");
      } else {
        users.push({ name: name.trim(), email: normalizedEmail, password });
        localStorage.setItem("canteenUsers", JSON.stringify(users));
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="auth-page">
        <div className="auth-card">
          <h1>Create Account 🎓</h1>
          <p className="auth-subtitle">Join CanteenFlow for instant campus meal orders</p>

          {errorMsg && (
            <div className="auth-alert error">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Anurag Reddy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />

            <label htmlFor="email">College Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />

            <label htmlFor="phone">Mobile Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />

            <label htmlFor="password">Password (min 6 characters)</label>
            <input
              id="password"
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="form-input"
            />

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
