import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CATEGORIES = ["Breakfast", "Lunch", "Snacks", "Beverages", "Desserts"];

export function AdminDashboard() {
  const { isAdminAuthenticated, adminUser } = useAuth();

  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "menu"
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Food Item Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: "",
    category: "Breakfast",
    price: "",
    preparationTime: "",
    description: "",
    imageUrl: "",
    isVeg: true,
    available: true,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    loadDashboardData();
  }, [orderStatusFilter]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);
      const [statsData, ordersData, foodsData] = await Promise.all([
        api.getOrderStats(),
        api.getAllOrders(orderStatusFilter),
        api.getFoodItems(),
      ]);
      setStats(statsData);
      setOrders(ordersData || []);
      setFoodItems(foodsData || []);
    } catch (err) {
      console.error("Dashboard data load error", err);
      setError("Failed to fetch admin data from backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
      // Refresh stats in background
      api.getOrderStats().then(setStats).catch(() => {});
    } catch (err) {
      alert("Failed to update order status: " + err.message);
    }
  }

  async function handleToggleAvailability(itemId) {
    try {
      const updated = await api.toggleFoodItemAvailability(itemId);
      setFoodItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, available: updated.available } : item))
      );
    } catch (err) {
      alert("Failed to toggle availability: " + err.message);
    }
  }

  async function handleDeleteItem(itemId, itemName) {
    if (!window.confirm(`Are you sure you want to remove "${itemName}" from the menu?`)) {
      return;
    }
    try {
      await api.deleteFoodItem(itemId);
      setFoodItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert("Failed to delete food item: " + err.message);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setItemFormData({
      name: "",
      category: "Breakfast",
      price: "",
      preparationTime: "10",
      description: "",
      imageUrl: "",
      isVeg: true,
      available: true,
    });
    setModalError("");
    setShowItemModal(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setItemFormData({
      name: item.name || "",
      category: item.category || "Breakfast",
      price: item.price ? String(item.price) : "",
      preparationTime: item.preparationTime ? String(item.preparationTime) : "10",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      isVeg: item.isVeg ?? true,
      available: item.available ?? true,
    });
    setModalError("");
    setShowItemModal(true);
  }

  async function handleItemFormSubmit(e) {
    e.preventDefault();
    setModalError("");

    if (!itemFormData.name.trim()) {
      setModalError("Food item name is required.");
      return;
    }

    const priceNum = parseFloat(itemFormData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setModalError("Please provide a valid price greater than 0.");
      return;
    }

    const payload = {
      name: itemFormData.name.trim(),
      category: itemFormData.category,
      price: priceNum,
      preparationTime: parseInt(itemFormData.preparationTime, 10) || 10,
      description: itemFormData.description.trim(),
      imageUrl:
        itemFormData.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop",
      isVeg: itemFormData.isVeg,
      available: itemFormData.available,
    };

    try {
      setModalSubmitting(true);
      if (editingItem) {
        const updated = await api.updateFoodItem(editingItem.id, payload);
        setFoodItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
      } else {
        const created = await api.createFoodItem(payload);
        setFoodItems((prev) => [created, ...prev]);
      }
      setShowItemModal(false);
    } catch (err) {
      setModalError(err.message || "Failed to save food item.");
    } finally {
      setModalSubmitting(false);
    }
  }

  // Filter orders by search input
  const filteredOrders = orders.filter((o) => {
    const s = orderSearch.toLowerCase().trim();
    if (!s) return true;
    return (
      o.orderNumber?.toLowerCase().includes(s) ||
      o.customerName?.toLowerCase().includes(s) ||
      o.customerPhone?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="page-wrapper admin-theme">
      <Navbar />

      <header className="admin-header-banner">
        <div className="section-container admin-header-content">
          <div>
            <div className="admin-staff-pill">
              <span>● Online Staff: {adminUser?.name || "Canteen Manager"}</span>
            </div>
            <h1>Canteen Operations Dashboard ⚙️</h1>
            <p>Real-time kitchen orders queue, preparation statuses & menu catalog control.</p>
          </div>

          <div className="admin-quick-actions">
            <button
              type="button"
              className="btn-refresh-dashboard"
              onClick={loadDashboardData}
            >
              ↻ Refresh Data
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={openCreateModal}
            >
              + Add New Dish
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main-container">
        <div className="section-container">
          {/* Key Metric Stats Cards */}
          <div className="stats-cards-grid">
            <div className="metric-card total-sales">
              <span className="metric-icon">💰</span>
              <div className="metric-details">
                <span className="metric-label">Total Revenue</span>
                <h3 className="metric-value">₹{stats?.totalRevenue?.toFixed(0) || "0"}</h3>
                <small className="metric-sub">{stats?.totalOrders || 0} total orders</small>
              </div>
            </div>

            <div className="metric-card pending-queue">
              <span className="metric-icon">⏳</span>
              <div className="metric-details">
                <span className="metric-label">Pending Orders</span>
                <h3 className="metric-value">{stats?.pendingOrders || 0}</h3>
                <small className="metric-sub">Awaiting confirmation</small>
              </div>
            </div>

            <div className="metric-card prep-queue">
              <span className="metric-icon">🍳</span>
              <div className="metric-details">
                <span className="metric-label">In Kitchen Prep</span>
                <h3 className="metric-value">{stats?.preparingOrders || 0}</h3>
                <small className="metric-sub">Chefs cooking</small>
              </div>
            </div>

            <div className="metric-card ready-queue">
              <span className="metric-icon">🔔</span>
              <div className="metric-details">
                <span className="metric-label">Ready for Pickup</span>
                <h3 className="metric-value">{stats?.readyOrders || 0}</h3>
                <small className="metric-sub">At delivery counter</small>
              </div>
            </div>

            <div className="metric-card completed-queue">
              <span className="metric-icon">✓</span>
              <div className="metric-details">
                <span className="metric-label">Completed Orders</span>
                <h3 className="metric-value">{stats?.completedOrders || 0}</h3>
                <small className="metric-sub">Collected by students</small>
              </div>
            </div>

            <div className="metric-card crowd-queue">
              <span className="metric-icon">👥</span>
              <div className="metric-details">
                <span className="metric-label">Active Kitchen Load</span>
                <h3 className="metric-value">{stats?.activeQueueCount || 0}</h3>
                <small className="metric-sub">Orders in active queue</small>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs-nav">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 Incoming Orders Queue ({orders.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              🍽️ Food Menu Catalog ({foodItems.length} Dishes)
            </button>
          </div>

          {/* Tab 1: Orders Management */}
          {activeTab === "orders" && (
            <div className="admin-orders-panel">
              <div className="orders-control-bar">
                <div className="status-filter-pills">
                  {["ALL", "Pending", "Confirmed", "Preparing", "Ready for Pickup", "Completed", "Cancelled"].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        className={`status-filter-pill ${
                          orderStatusFilter === st ? "active" : ""
                        }`}
                        onClick={() => setOrderStatusFilter(st)}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="order-search-box">
                  <input
                    type="text"
                    placeholder="Search by Order #, Name, Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
              </div>

              {loading ? (
                <Loading message="Fetching live canteen orders..." />
              ) : error ? (
                <ErrorMessage message={error} onRetry={loadDashboardData} />
              ) : filteredOrders.length === 0 ? (
                <div className="empty-orders-state">
                  <span className="empty-icon">📭</span>
                  <h3>No orders match this status</h3>
                  <p>Incoming student orders will immediately show up in this queue.</p>
                </div>
              ) : (
                <div className="admin-orders-list">
                  {filteredOrders.map((ord) => (
                    <article key={ord.id} className="admin-order-card">
                      <div className="admin-order-card-header">
                        <div className="order-id-group">
                          <strong className="order-num-tag">{ord.orderNumber}</strong>
                          <span className="order-time-stamp">
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="order-status-badge-container">
                          <StatusBadge status={ord.status} />
                        </div>
                      </div>

                      <div className="admin-order-card-body">
                        <div className="customer-info-row">
                          <span>
                            <strong>👤 {ord.customerName}</strong> ({ord.customerPhone})
                          </span>
                          <span className="payment-tag">
                            💳 {ord.paymentMethod} • ₹{ord.totalAmount?.toFixed(0)}
                          </span>
                        </div>

                        {ord.notes && (
                          <div className="order-kitchen-notes">
                            <strong>Note:</strong> {ord.notes}
                          </div>
                        )}

                        <div className="order-items-compact-list">
                          {ord.items?.map((item) => (
                            <div key={item.id} className="compact-item">
                              <span>{item.foodItemName}</span>
                              <strong>× {item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="admin-order-card-footer">
                        <label className="status-update-label">
                          <span>Set Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="status-dropdown"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </label>

                        <div className="quick-action-buttons">
                          {ord.status === "Pending" && (
                            <button
                              type="button"
                              className="btn-quick-action btn-confirm"
                              onClick={() => handleStatusChange(ord.id, "Confirmed")}
                            >
                              ✓ Confirm
                            </button>
                          )}
                          {ord.status === "Confirmed" && (
                            <button
                              type="button"
                              className="btn-quick-action btn-prep"
                              onClick={() => handleStatusChange(ord.id, "Preparing")}
                            >
                              🍳 Start Cooking
                            </button>
                          )}
                          {ord.status === "Preparing" && (
                            <button
                              type="button"
                              className="btn-quick-action btn-ready"
                              onClick={() => handleStatusChange(ord.id, "Ready for Pickup")}
                            >
                              🔔 Mark Ready
                            </button>
                          )}
                          {ord.status === "Ready for Pickup" && (
                            <button
                              type="button"
                              className="btn-quick-action btn-complete"
                              onClick={() => handleStatusChange(ord.id, "Completed")}
                            >
                              🎉 Hand Over
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Food Menu Catalog Management */}
          {activeTab === "menu" && (
            <div className="admin-menu-panel">
              <div className="menu-panel-toolbar">
                <h3>Campus Food Items ({foodItems.length})</h3>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={openCreateModal}
                >
                  + Add New Food Item
                </button>
              </div>

              <div className="admin-food-table-wrapper">
                <table className="admin-food-table">
                  <thead>
                    <tr>
                      <th>Dish</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Prep Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems.map((item) => (
                      <tr key={item.id} className={item.available ? "" : "row-unavailable"}>
                        <td>
                          <div className="table-food-item-cell">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="table-food-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
                              }}
                            />
                            <div>
                              <strong>{item.name}</strong>
                              <p className="table-food-desc">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-sm">{item.category}</span>
                        </td>
                        <td>
                          <span className={`dietary-badge ${item.isVeg ? "veg" : "non-veg"}`}>
                            <span className="dot"></span>
                            <small>{item.isVeg ? "Veg" : "Non-Veg"}</small>
                          </span>
                        </td>
                        <td>
                          <strong>₹{item.price?.toFixed(0)}</strong>
                        </td>
                        <td>⏱ {item.preparationTime} min</td>
                        <td>
                          <button
                            type="button"
                            className={`btn-stock-toggle ${
                              item.available ? "in-stock" : "sold-out"
                            }`}
                            onClick={() => handleToggleAvailability(item.id)}
                            title="Click to toggle availability"
                          >
                            {item.available ? "● Available" : "○ Sold Out"}
                          </button>
                        </td>
                        <td>
                          <div className="table-actions-group">
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => openEditModal(item)}
                              title="Edit item"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              title="Delete item"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Food Item Modal */}
      {showItemModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>{editingItem ? "Edit Food Item" : "Add New Dish to Menu"}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowItemModal(false)}
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="modal-alert-error">
                <span>⚠️ {modalError}</span>
              </div>
            )}

            <form onSubmit={handleItemFormSubmit} className="modal-form">
              <div className="modal-form-grid">
                <div className="form-group full-width">
                  <label>Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masala Dosa / Chicken Biryani"
                    value={itemFormData.name}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={itemFormData.category}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, category: e.target.value })
                    }
                    className="form-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="e.g. 60"
                    value={itemFormData.price}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, price: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Preparation Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    value={itemFormData.preparationTime}
                    onChange={(e) =>
                      setItemFormData({
                        ...itemFormData,
                        preparationTime: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Dietary Type</label>
                  <select
                    value={itemFormData.isVeg ? "true" : "false"}
                    onChange={(e) =>
                      setItemFormData({
                        ...itemFormData,
                        isVeg: e.target.value === "true",
                      })
                    }
                    className="form-select"
                  >
                    <option value="true">🟢 Vegetarian</option>
                    <option value="false">🔴 Non-Vegetarian</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Image URL (High-res photo link)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={itemFormData.imageUrl}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, imageUrl: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Flavor profile, ingredients, side dips served..."
                    value={itemFormData.description}
                    onChange={(e) =>
                      setItemFormData({
                        ...itemFormData,
                        description: e.target.value,
                      })
                    }
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={itemFormData.available}
                      onChange={(e) =>
                        setItemFormData({
                          ...itemFormData,
                          available: e.target.checked,
                        })
                      }
                    />
                    <span>Available immediately for orders today</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="btn-primary"
                >
                  {modalSubmitting
                    ? "Saving Dish..."
                    : editingItem
                    ? "Save Changes"
                    : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminDashboard;
