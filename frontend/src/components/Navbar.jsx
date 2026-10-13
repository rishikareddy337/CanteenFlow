import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { cartCount } = useCart();
  const { isAdminAuthenticated, logoutAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleAdminLogout() {
    logoutAdmin();
    navigate("/");
  }

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">
            Canteen<span className="brand-highlight">Flow</span>
          </span>
          <span className="brand-badge">Campus</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Food Menu
          </NavLink>

          <NavLink
            to="/track"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Track Order
          </NavLink>

          {isAdminAuthenticated ? (
            <div className="nav-admin-group">
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link admin-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚙️ Dashboard
              </NavLink>
              <button
                type="button"
                className="btn-admin-logout"
                onClick={handleAdminLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/admin/login"
              className={({ isActive }) => `nav-link staff-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🔒 Staff Login
            </NavLink>
          )}

          <Link
            to="/cart"
            className="nav-cart-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
