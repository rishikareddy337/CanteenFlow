import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FoodCard from "../components/FoodCard";
import CategoryFilter from "../components/CategoryFilter";
import Loading, { SkeletonGrid } from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { useCart } from "../CartContext";
import api from "../services/api";

export function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [vegOnly, setVegOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cartCount, cartTotal } = useCart();

  useEffect(() => {
    // Sync URL params when category or search changes
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categoryFromUrl !== category) {
      setCategory(categoryFromUrl);
    }
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl !== null && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    loadFoodItems();
  }, [category]);

  async function loadFoodItems() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFoodItems(category);
      setFoodItems(data || []);
    } catch (err) {
      console.error("Failed to load food items", err);
      setError("Unable to load food menu from backend. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryChange(newCategory) {
    setCategory(newCategory);
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", newCategory);
    }
    setSearchParams(newParams);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set("search", val);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  }

  // Filter & sort logic
  let filtered = foodItems.filter((item) => {
    // Search
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term);

    // Veg filter
    const matchesVeg = !vegOnly || item.isVeg === true;

    // In-stock filter
    const matchesStock = !inStockOnly || item.available !== false;

    return matchesSearch && matchesVeg && matchesStock;
  });

  // Sorting
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "prep-time") {
    filtered.sort((a, b) => (a.preparationTime || 10) - (b.preparationTime || 10));
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <header className="page-header menu-header-banner">
        <div className="header-container">
          <span className="page-eyebrow">CAMPUS DELIGHTS</span>
          <h1 className="page-title">Explore Our Food Menu</h1>
          <p className="page-subtitle">
            Freshly prepared breakfast, satisfying lunches, savory evening snacks, cooling beverages & desserts.
          </p>
        </div>
      </header>

      <main className="menu-main-content">
        <div className="menu-container">
          {/* Search and Filter Toolbar */}
          <div className="menu-toolbar">
            <div className="search-bar-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search food by name, ingredient, or meal..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="menu-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => handleSearchChange({ target: { value: "" } })}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-controls-group">
              <label className={`filter-toggle ${vegOnly ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                />
                <span className="toggle-dot veg-dot"></span>
                <span>Veg Only</span>
              </label>

              <label className={`filter-toggle ${inStockOnly ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>Available Now</span>
              </label>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="prep-time">Prep Time: Fastest</option>
              </select>
            </div>
          </div>

          {/* Category Navigation Pills */}
          <CategoryFilter
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
          />

          {/* Results Summary */}
          <div className="results-summary-row">
            <div>
              <h2 className="current-category-heading">
                {category === "All" ? "All Canteen Specialties" : `${category} Specialties`}
              </h2>
              <span className="items-count-badge">
                Showing {filtered.length} item{filtered.length === 1 ? "" : "s"}
              </span>
            </div>

            {(searchTerm || vegOnly || inStockOnly) && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm("");
                  setVegOnly(false);
                  setInStockOnly(false);
                  setCategory("All");
                  setSearchParams({});
                }}
              >
                Reset Filters ↺
              </button>
            )}
          </div>

          {/* Content Loading / Error / Empty / Grid */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadFoodItems} />
          ) : filtered.length === 0 ? (
            <div className="no-results-card">
              <div className="empty-icon">🍽️</div>
              <h3>No items matched your filters</h3>
              <p>Try searching for another dish or reset your dietary filters to view all menu options.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setVegOnly(false);
                  setInStockOnly(false);
                  setCategory("All");
                  setSearchParams({});
                }}
              >
                View Full Menu
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {filtered.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Cart Bar for quick checkout when user adds items */}
      {cartCount > 0 && (
        <aside className="floating-cart-bar">
          <div className="floating-cart-container">
            <div className="floating-cart-info">
              <span className="cart-pill-count">🛒 {cartCount} item{cartCount > 1 ? "s" : ""}</span>
              <span className="cart-pill-price">₹{cartTotal.toFixed(0)}</span>
            </div>
            <Link to="/cart" className="floating-cart-btn">
              View Cart & Checkout →
            </Link>
          </div>
        </aside>
      )}

      <Footer />
    </div>
  );
}

export default Menu;