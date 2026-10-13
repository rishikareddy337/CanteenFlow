import { Link, useLocation, Navigate } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();

  // Get order details sent from the Cart page
  const state = location.state;

  // Support both order data formats
  const order = state?.order || (
    state?.orderItems
      ? {
          id: `CF${Date.now().toString().slice(-6)}`,
          items: state.orderItems,
          total: state.totalPrice,
          preparationTime: state.preparationTime,
        }
      : null
  );

  // If no order details exist, go back to the menu
  if (!order) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="confirmation-page">
      <nav className="confirmation-navbar">
        <Link to="/" className="confirmation-logo">
          🍽️ CanteenFlow
        </Link>

        <Link to="/menu">Menu</Link>
      </nav>

      <main className="confirmation-content">
        <div className="success-icon">✓</div>

        <h1>Order Placed Successfully!</h1>

        <p className="confirmation-message">
          Thank you for ordering with CanteenFlow.
        </p>

        <div className="order-number">
          <span>YOUR ORDER ID</span>
          <h2>{order.id}</h2>
        </div>

        <section className="confirmation-card">
          <h2>Order Summary</h2>

          {order.items.map((item) => (
            <div className="confirmation-item" key={item.id}>
              <span>
                {item.emoji || "🍽️"} {item.name} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="confirmation-total">
            <span>Total Amount</span>
            <strong>₹{order.total}</strong>
          </div>

          <div className="preparation-time">
            <span>⏱️ Estimated Preparation Time</span>
            <strong>{order.preparationTime} minutes</strong>
          </div>

          <div className="order-status">
            <span>Order Status</span>
            <strong>Order Placed</strong>
          </div>
        </section>

        <p className="confirmation-note">
          This is a demonstration order. Live kitchen updates
          will be added in a future step.
        </p>

        <div className="confirmation-actions">
          <Link to="/menu" className="order-again-button">
            Order More Food
          </Link>

          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default OrderConfirmation;