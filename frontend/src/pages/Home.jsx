import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FoodCard from "../components/FoodCard";
import Loading from "../components/Loading";
import api from "../services/api";

const categories = [
  { name: "Breakfast", icon: "🥞", desc: "Dosa, Idli, Poori", count: "Fresh & Hot" },
  { name: "Lunch", icon: "🍛", desc: "Biryani, Thali, Paneer", count: "Filling Meals" },
  { name: "Snacks", icon: "🍟", desc: "Samosa, Burgers, Fries", count: "Quick Bites" },
  { name: "Beverages", icon: "☕", desc: "Chai, Coffee, Shakes", count: "Chilled & Warm" },
  { name: "Desserts", icon: "🍨", desc: "Gulab Jamun, Sundae", count: "Sweet Cravings" },
];

export function Home() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [homeSearch, setHomeSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [foodsData, statsData] = await Promise.all([
          api.getFoodItems(),
          api.getOrderStats().catch(() => null),
        ]);
        // Pick 6 popular / featured items across categories
        setFeaturedFoods(foodsData ? foodsData.slice(0, 6) : []);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load home data", err);
        setError("Could not load featured food items from backend.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(homeSearch.trim())}`);
    } else {
      navigate("/menu");
    }
  }

  // Calculate live crowd level
  const activeOrders = stats?.activeQueueCount || 0;
  let crowdStatus = "Calm & Fast";
  let crowdColor = "crowd-low";
  let waitEstimate = "5 - 10 mins";

  if (activeOrders > 10) {
    crowdStatus = "Peak Rush Hour";
    crowdColor = "crowd-high";
    waitEstimate = "20 - 25 mins";
  } else if (activeOrders > 4) {
    crowdStatus = "Moderate Crowd";
    crowdColor = "crowd-med";
    waitEstimate = "12 - 15 mins";
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span>SMART CAMPUS FOOD ORDERING SYSTEM</span>
            </div>

            <h1 className="hero-title">
              Skip The Long Queues.
              <br />
              <span className="hero-highlight">Your Food Is Ready When You Arrive.</span>
            </h1>

            <p className="hero-desc">
              Order your favourite breakfast, lunch specials, and evening snacks before classes end.
              Track your live preparation status and pick up without wasting precious break time!
            </p>

            {/* Quick Hero Search */}
            <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Craving Biryani, Dosa, Samosa, Cold Coffee..."
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">
                Search Menu
              </button>
            </form>

            <div className="hero-actions">
              <Link to="/menu" className="btn-primary hero-cta">
                🍽️ Order Food Now
              </Link>
              <Link to="/track" className="btn-secondary hero-track-cta">
                📦 Track My Order
              </Link>
            </div>

            {/* Live Crowd & Kitchen Status Card */}
            <div className="crowd-banner">
              <div className="crowd-item">
                <span className="crowd-label">Live Canteen Crowd</span>
                <span className={`crowd-value ${crowdColor}`}>● {crowdStatus}</span>
              </div>
              <div className="crowd-divider"></div>
              <div className="crowd-item">
                <span className="crowd-label">Orders in Kitchen</span>
                <span className="crowd-value">{activeOrders} active orders</span>
              </div>
              <div className="crowd-divider"></div>
              <div className="crowd-item">
                <span className="crowd-label">Average Wait Time</span>
                <span className="crowd-value">⏱ {waitEstimate}</span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop"
                alt="Delicious Campus Food"
                className="hero-main-img"
              />
              <div className="floating-card top-float">
                <span className="float-icon">⚡</span>
                <div>
                  <strong>Pre-Order Online</strong>
                  <small>No standing in lines</small>
                </div>
              </div>
              <div className="floating-card bottom-float">
                <span className="float-icon">🔔</span>
                <div>
                  <strong>Hot & Ready Alert</strong>
                  <small>Pick up instantly</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="category-shortcuts-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">EXPLORE BY MEAL</span>
            <h2 className="section-title">What are you in the mood for?</h2>
            <p className="section-subtitle">
              Jump straight into our delicious campus selections prepared fresh by our canteen chefs.
            </p>
          </div>

          <div className="category-shortcuts-grid">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="category-shortcut-card"
              >
                <div className="category-icon-circle">{cat.icon}</div>
                <h3 className="category-card-name">{cat.name}</h3>
                <p className="category-card-desc">{cat.desc}</p>
                <span className="category-arrow">Explore Menu →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Popular Food Items */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">POPULAR AMONG STUDENTS</span>
              <h2 className="section-title">Today's Trending Specials</h2>
            </div>
            <Link to="/menu" className="view-all-link">
              View Complete Menu ({featuredFoods.length > 0 ? "26+ items" : "All"}) →
            </Link>
          </div>

          {loading ? (
            <Loading message="Fetching canteen menu from database..." />
          ) : error ? (
            <div className="error-card">
              <p>{error}</p>
              <Link to="/menu" className="btn-primary">Browse All Menu</Link>
            </div>
          ) : (
            <div className="food-grid">
              {featuredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why CanteenFlow / Features Section */}
      <section className="why-us-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">SMART CAMPUS ADVANTAGE</span>
            <h2 className="section-title">How CanteenFlow Transforms Canteen Life</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-box">
              <div className="feature-icon">⏱️</div>
              <h3>Zero Waiting in Lines</h3>
              <p>
                Browse the menu between lectures, select your meal, and receive an instant order number with an accurate prep time.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🍳</div>
              <h3>Live Kitchen Tracking</h3>
              <p>
                Watch your order progress from Pending to Confirmed, Preparing, and Ready for Pickup. No more crowd guessing!
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">💳</div>
              <h3>Flexible Cashless & Cash</h3>
              <p>
                Choose UPI payment on checkout or choose Cash on Pickup right at the delivery counter.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📊</div>
              <h3>Optimized Crowd Management</h3>
              <p>
                Smart algorithms estimate waiting times according to real-time kitchen queues so staff are never overwhelmed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-container">
          <h2>Hungry Between Lectures? Don't Wait!</h2>
          <p>Explore today's hot specialties and pick up your meal in minutes.</p>
          <Link to="/menu" className="btn-cta-white">
            Explore Full Menu Now →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
