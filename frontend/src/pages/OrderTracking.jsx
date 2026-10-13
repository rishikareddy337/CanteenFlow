import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import api from "../services/api";

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: "📝", desc: "Received by system" },
  { key: "Confirmed", label: "Confirmed", icon: "✓", desc: "Accepted by kitchen" },
  { key: "Preparing", label: "Preparing", icon: "🍳", desc: "Chef is cooking" },
  { key: "Ready for Pickup", label: "Ready for Pickup", icon: "🔔", desc: "Hot at Counter" },
  { key: "Completed", label: "Completed", icon: "🎉", desc: "Collected & Enjoyed" },
];

export function OrderTracking() {
  const { orderNumber: urlOrderNumber } = useParams();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState(urlOrderNumber || "");
  const [currentOrderNumber, setCurrentOrderNumber] = useState(urlOrderNumber || "");
  const [order, setOrder] = useState(location.state?.order || null);
  const [isNewOrder, setIsNewOrder] = useState(location.state?.newOrderCreated || false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    if (urlOrderNumber) {
      setCurrentOrderNumber(urlOrderNumber);
      setSearchInput(urlOrderNumber);
      fetchOrder(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  // Auto poll every 10 seconds for real-time status update
  useEffect(() => {
    if (!currentOrderNumber) return;

    const interval = setInterval(() => {
      fetchOrder(currentOrderNumber, false);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentOrderNumber]);

  async function fetchOrder(orderNum, showLoader = true) {
    if (!orderNum) return;
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const data = await api.getOrderByNumber(orderNum);
      setOrder(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Order fetch failed", err);
      if (showLoader) {
        setError(`No order found matching "${orderNum}". Please verify your order number.`);
        setOrder(null);
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsNewOrder(false);
      setCurrentOrderNumber(searchInput.trim());
      fetchOrder(searchInput.trim(), true);
    }
  }

  function getStepIndex(status) {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s.includes("complete")) return 4;
    if (s.includes("ready")) return 3;
    if (s.includes("prep")) return 2;
    if (s.includes("confirm")) return 1;
    return 0;
  }

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status?.toLowerCase().includes("cancel");

  return (
    <div className="page-wrapper">
      <Navbar />

      <header className="page-header track-header-banner">
        <div className="header-container">
          <span className="page-eyebrow">LIVE KITCHEN RADAR</span>
          <h1 className="page-title">Live Order Tracking 📦</h1>
          <p className="page-subtitle">
            Monitor your order status in real time from kitchen preparation to counter pickup.
          </p>
        </div>
      </header>

      <main className="track-main-container">
        <div className="section-container">
          {/* Order Search Box */}
          <div className="track-search-card">
            <form onSubmit={handleSearchSubmit} className="track-search-form">
              <label htmlFor="orderSearch">Enter Order ID or Order Number:</label>
              <div className="track-search-input-group">
                <input
                  id="orderSearch"
                  type="text"
                  placeholder="e.g. CF-715075"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="track-input"
                />
                <button type="submit" className="btn-primary">
                  Track Order
                </button>
              </div>
            </form>
          </div>

          {/* New order banner */}
          {isNewOrder && order && (
            <div className="order-success-banner">
              <span className="success-check-icon">✓</span>
              <div>
                <h3>Order Placed Successfully with Canteen Kitchen!</h3>
                <p>
                  Your order is registered in the queue. Show your Order ID at Counter #1 to collect when ready.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <Loading message="Checking live kitchen updates..." />
          ) : error ? (
            <div className="error-card">
              <p>{error}</p>
              <div className="track-error-actions">
                <Link to="/menu" className="btn-primary">Explore Menu</Link>
              </div>
            </div>
          ) : order ? (
            <div className="tracking-dashboard">
              {/* Status Header Box */}
              <div className="tracking-hero-box">
                <div className="order-id-display">
                  <span className="id-label">YOUR ORDER ID</span>
                  <h2 className="id-code">{order.orderNumber}</h2>
                  <span className="order-time">
                    Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="order-badge-live">
                  <StatusBadge status={order.status} />
                  <button
                    type="button"
                    className="btn-refresh-status"
                    onClick={() => fetchOrder(order.orderNumber, false)}
                    title="Refresh order status"
                  >
                    ↻ Live (auto updates)
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              {isCancelled ? (
                <div className="cancelled-banner">
                  <span className="cancel-icon">✕</span>
                  <div>
                    <h3>This order has been cancelled</h3>
                    <p>Please reach out to the canteen counter manager if you have any questions.</p>
                  </div>
                </div>
              ) : (
                <div className="stepper-card">
                  <div className="stepper-track">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={step.key}
                          className={`stepper-node ${isCompleted ? "completed" : ""} ${
                            isCurrent ? "current" : ""
                          }`}
                        >
                          <div className="step-circle">
                            <span className="step-icon">{step.icon}</span>
                          </div>
                          <span className="step-label">{step.label}</span>
                          <span className="step-desc">{step.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Info & Items Details */}
              <div className="tracking-two-column">
                {/* Items List */}
                <div className="order-details-card">
                  <h3>Dishes in this Order</h3>
                  <div className="order-items-table">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item-detail-row">
                        <div className="item-name-qty">
                          <span className="item-bullet">🍽️</span>
                          <strong>{item.foodItemName}</strong>
                          <span className="qty-tag">× {item.quantity}</span>
                        </div>
                        <span className="item-price-sum">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-divider"></div>

                  <div className="order-totals-breakdown">
                    <div className="total-line">
                      <span>Total Paid / Payable</span>
                      <strong>₹{order.totalAmount?.toFixed(0)}</strong>
                    </div>
                    <div className="total-line">
                      <span>Payment Method</span>
                      <span>{order.paymentMethod || "Cash on Pickup"}</span>
                    </div>
                    <div className="total-line">
                      <span>Payment Status</span>
                      <span className={`pay-status ${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pickup & Kitchen Instructions */}
                <div className="order-pickup-card">
                  <h3>Pickup & Kitchen Info</h3>

                  <div className="pickup-info-box">
                    <div className="info-icon-box">⏱️</div>
                    <div>
                      <strong>Estimated Prep Time</strong>
                      <p>{order.estimatedWaitTime || 12} minutes from ordering</p>
                    </div>
                  </div>

                  <div className="pickup-info-box">
                    <div className="info-icon-box">📍</div>
                    <div>
                      <strong>Pickup Counter</strong>
                      <p>Counter #1 & #2 (Main Cafeteria Hall)</p>
                    </div>
                  </div>

                  <div className="pickup-info-box">
                    <div className="info-icon-box">👤</div>
                    <div>
                      <strong>Ordered For</strong>
                      <p>{order.customerName} ({order.customerPhone})</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="pickup-info-box notes-box">
                      <div className="info-icon-box">📝</div>
                      <div>
                        <strong>Kitchen Notes</strong>
                        <p>{order.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="next-steps-banner">
                    {order.status === "Ready for Pickup" ? (
                      <p className="ready-alert">
                        🔔 <strong>Your order is ready!</strong> Please proceed to Counter #1 to collect your hot meal.
                      </p>
                    ) : order.status === "Completed" ? (
                      <p className="completed-alert">
                        🎉 Order completed! Hope you enjoyed your meal. See you again soon!
                      </p>
                    ) : (
                      <p className="preparing-alert">
                        👨‍🍳 Our canteen kitchen is preparing your dishes fresh. Please wait until status updates to Ready for Pickup.
                      </p>
                    )}
                  </div>

                  <div className="track-card-actions">
                    <Link to="/menu" className="btn-secondary">
                      Order More Items
                    </Link>
                    <Link to="/" className="btn-link">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="track-placeholder-card">
              <span className="placeholder-icon">🔎</span>
              <h3>Have an order number?</h3>
              <p>Enter your 8-digit order number (e.g. CF-715075) above to track its live preparation progress.</p>
              <Link to="/menu" className="btn-primary">Browse Food Menu</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderTracking;
