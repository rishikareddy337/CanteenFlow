import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;

  const [paymentMethod, setPaymentMethod] = useState("pickup");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!orderData?.orderItems || orderData.orderItems.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  const items = orderData.orderItems;
  const totalPrice = orderData.totalPrice;
  const totalItems = orderData.totalItems;
  const preparationTime = orderData.preparationTime;

  function handlePayment() {
    if (processing) return;

    setProcessing(true);
    setPaymentMessage("");

    // Demo only: no real payment is processed.
    const paymentStatus =
      paymentMethod === "pickup"
        ? "Pay on Pickup"
        : "Demo Payment Successful";

    navigate("/order-confirmation", {
      state: {
        orderItems: items,
        totalPrice,
        totalItems,
        preparationTime,
        paymentMethod:
          paymentMethod === "pickup" ? "Cash on Pickup" : "UPI (Demo)",
        paymentStatus,
      },
    });
  }

  return (
    <div className="payment-page">
      <nav className="payment-navbar">
        <Link to="/" className="payment-logo">
          🍽️ CanteenFlow
        </Link>

        <Link to="/menu" className="payment-menu-link">
          Menu
        </Link>
      </nav>

      <main className="payment-container">
        <div className="payment-heading">
          <span className="payment-icon">💳</span>
          <h1>Checkout & Payment</h1>
          <p>Review your order and select a payment method.</p>
        </div>

        <div className="payment-layout">
          <section className="payment-method-card">
            <h2>Choose Payment Method</h2>

            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "pickup" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("pickup")}
            >
              <span className="method-icon">💵</span>

              <span className="method-details">
                <strong>Cash on Pickup</strong>
                <small>Pay at the canteen counter</small>
              </span>

              <span className="method-radio">
                {paymentMethod === "pickup" ? "●" : "○"}
              </span>
            </button>

            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "upi" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <span className="method-icon">📱</span>

              <span className="method-details">
                <strong>UPI Demo Payment</strong>
                <small>Simulate a successful payment</small>
              </span>

              <span className="method-radio">
                {paymentMethod === "upi" ? "●" : "○"}
              </span>
            </button>

            {paymentMethod === "upi" && (
              <div className="upi-demo-message">
                <span>🧪</span>
                <div>
                  <strong>Demo mode</strong>
                  <p>
                    No UPI app will open and no money will be transferred.
                    Clicking the button simulates success.
                  </p>
                </div>
              </div>
            )}

            {paymentMessage && (
              <p className="payment-error">{paymentMessage}</p>
            )}

            <button
              type="button"
              className="confirm-payment-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {paymentMethod === "pickup"
                ? "Confirm Order"
                : "Simulate UPI Payment"}
            </button>

            <Link to="/cart" className="back-to-cart">
              ← Back to Cart
            </Link>
          </section>

          <section className="payment-summary-card">
            <h2>Order Summary</h2>

            <div className="payment-items">
              {items.map((item) => (
                <div className="payment-item" key={item.id}>
                  <span>
                    {item.emoji || "🍽️"} {item.name} × {item.quantity}
                  </span>

                  <strong>
                    ₹{Number(item.price) * Number(item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="payment-summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="payment-summary-row payment-grand-total">
              <span>Total Amount</span>
              <strong>₹{totalPrice}</strong>
            </div>

            <div className="payment-preparation">
              ⏱️ Estimated preparation time:{" "}
              <strong>{preparationTime} minutes</strong>
            </div>

            <p className="payment-secure-note">
              🔒 Demo checkout — no real payment details are collected.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Payment;