import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../CartContext";
import api from "../services/api";

export function Checkout() {
  const { cart, cartTotal, cartEstimatedWaitTime, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Pickup");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (cart.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!customerName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number for pickup verification.");
      return;
    }

    const orderPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: cleanPhone,
      notes: notes.trim() || undefined,
      paymentMethod,
      items: cart.map((item) => ({
        foodItemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      setSubmitting(true);
      const createdOrder = await api.createOrder(orderPayload);

      // Successfully saved by backend!
      clearCart();

      // Navigate to order tracking page with created order
      navigate(`/track/${createdOrder.orderNumber}`, {
        state: { order: createdOrder, newOrderCreated: true },
      });
    } catch (err) {
      console.error("Order creation failed", err);
      setErrorMsg(err.message || "Failed to place your order. Please check the items and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <header className="page-header checkout-header-banner">
        <div className="header-container">
          <span className="page-eyebrow">FINAL STEP</span>
          <h1 className="page-title">Checkout & Pickup Details 🧾</h1>
          <p className="page-subtitle">
            Provide your contact details so the kitchen counter can notify and hand over your meal.
          </p>
        </div>
      </header>

      <main className="checkout-main-container">
        <div className="section-container">
          <form className="checkout-two-column-layout" onSubmit={handleOrderSubmit}>
            {/* Left Column: Form Details */}
            <div className="checkout-form-column">
              {errorMsg && (
                <div className="checkout-alert error">
                  <span className="alert-icon">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="checkout-card">
                <div className="checkout-card-header">
                  <span className="step-num">1</span>
                  <h3>Contact & Pickup Information</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="customerName">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      placeholder="e.g. Anurag Reddy / Ananya Sen"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customerPhone">
                      Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      placeholder="e.g. 9876543210 (10 digits)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="form-input"
                    />
                    <small className="field-hint">Used to verify counter pickup</small>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="customerEmail">College Email (Optional)</label>
                    <input
                      id="customerEmail"
                      type="email"
                      placeholder="e.g. student@college.edu"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="notes">Special Kitchen Instructions (Optional)</label>
                    <textarea
                      id="notes"
                      rows="3"
                      placeholder="e.g. Less spicy, Extra coconut chutney, No onions, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="form-textarea"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <span className="step-num">2</span>
                  <h3>Select Payment Option</h3>
                </div>

                <div className="payment-options-grid">
                  <label
                    className={`payment-option-box ${
                      paymentMethod === "Cash on Pickup" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Pickup"
                      checked={paymentMethod === "Cash on Pickup"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-box-content">
                      <span className="pay-icon">💵</span>
                      <div>
                        <strong>Cash on Counter Pickup</strong>
                        <p>Pay cash or UPI scan right at Counter #1 when your food is ready.</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`payment-option-box ${
                      paymentMethod === "UPI" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-box-content">
                      <span className="pay-icon">📱</span>
                      <div>
                        <strong>Instant UPI Pre-Payment (Demo)</strong>
                        <p>Fast contactless online payment via Google Pay, PhonePe, or Paytm.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div className="checkout-summary-column">
              <div className="order-summary-card">
                <h3 className="summary-title">Order Items ({cart.length})</h3>

                <div className="checkout-items-mini-list">
                  {cart.map((item) => (
                    <div key={item.id} className="checkout-item-mini">
                      <div className="item-mini-name">
                        <strong>{item.name}</strong>
                        <small>× {item.quantity}</small>
                      </div>
                      <span className="item-mini-price">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(0)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Estimated Wait Time</span>
                    <span>⏱ ~{cartEstimatedWaitTime} mins</span>
                  </div>

                  <div className="summary-row">
                    <span>Payment Method</span>
                    <strong className="text-primary">{paymentMethod}</strong>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{cartTotal.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-checkout-primary"
                >
                  {submitting ? (
                    <span className="btn-spinner-label">
                      <span className="mini-spinner"></span> Submitting Order to Kitchen...
                    </span>
                  ) : (
                    `Confirm & Place Order (₹${cartTotal.toFixed(0)}) →`
                  )}
                </button>

                <p className="order-policy-hint">
                  By confirming, your order will be submitted directly to the canteen kitchen preparation queue.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;
