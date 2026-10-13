import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import { useCart } from "../CartContext";

export function Cart() {
  const { cart, cartCount, cartTotal, cartEstimatedWaitTime, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Navbar />

      <header className="page-header cart-header-banner">
        <div className="header-container">
          <span className="page-eyebrow">REVIEW SELECTION</span>
          <h1 className="page-title">Your Food Cart 🛒</h1>
          <p className="page-subtitle">
            Review your dishes, adjust servings, and proceed to checkout for fast counter pickup.
          </p>
        </div>
      </header>

      <main className="cart-main-container">
        <div className="section-container">
          {cart.length === 0 ? (
            <div className="empty-cart-card">
              <div className="empty-cart-graphic">🛍️</div>
              <h2>Your food tray is currently empty</h2>
              <p>
                Looks like you haven't selected any canteen dishes yet. Browse today's fresh menu to add hot meals!
              </p>
              <Link to="/menu" className="btn-primary btn-large">
                🍽️ Browse Today's Menu
              </Link>
            </div>
          ) : (
            <div className="cart-two-column-layout">
              {/* Left Column: Cart items */}
              <div className="cart-items-column">
                <div className="cart-header-actions">
                  <h3>
                    Selected Dishes ({cartCount} item{cartCount > 1 ? "s" : ""})
                  </h3>
                  <div className="cart-top-links">
                    <Link to="/menu" className="btn-link-action">
                      + Add More Food
                    </Link>
                    <button
                      type="button"
                      className="btn-clear-cart"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to clear your cart?")) {
                          clearCart();
                        }
                      }}
                    >
                      Clear Tray
                    </button>
                  </div>
                </div>

                <div className="cart-items-list">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="cart-pickup-note">
                  <span className="note-icon">💡</span>
                  <div>
                    <strong>Campus Pickup Policy</strong>
                    <p>
                      Orders are prepared fresh. Please arrive at the Canteen Pickup Counter when your order
                      status marks "Ready for Pickup".
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="cart-summary-column">
                <div className="order-summary-card">
                  <h3 className="summary-title">Order Summary</h3>

                  <div className="summary-rows">
                    <div className="summary-row">
                      <span>Items Subtotal</span>
                      <span>₹{cartTotal.toFixed(0)}</span>
                    </div>

                    <div className="summary-row">
                      <span>Campus Convenience Fee</span>
                      <span className="text-free">FREE (₹0)</span>
                    </div>

                    <div className="summary-row">
                      <span>Estimated Kitchen Time</span>
                      <span>⏱ ~{cartEstimatedWaitTime} mins</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total-row">
                      <span>Total Amount Payable</span>
                      <span className="total-amount">₹{cartTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-checkout-primary"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout →
                  </button>

                  <div className="secure-badge">
                    <span>🔒 Safe & Fast Campus Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;