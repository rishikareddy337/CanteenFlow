
import "./App.css";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>🍽️ CanteenFlow</h2>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </nav>

      <section className="hero">
        <p className="tagline">SMART CAMPUS FOOD EXPERIENCE</p>

        <h1>
          Your Food.
          <br />
          Your Time.
          <br />
          <span>Your Canteen.</span>
        </h1>

        <p className="description">
          Order your favourite food before reaching the canteen.
          Skip long queues and enjoy a smarter campus food experience.
        </p>

        <a href="/menu" className="order-button">
          Explore Menu →
        </a>

        <div className="hero-info">
          <div>
            <strong>Easy Ordering</strong>
            <p>Order in a few clicks</p>
          </div>

          <div>
            <strong>Live Order Status</strong>
            <p>Know when food is ready</p>
          </div>

          <div>
            <strong>Less Waiting</strong>
            <p>Save time between classes</p>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <p className="tagline">MADE FOR STUDENTS</p>
        <h2>A better way to grab a bite.</h2>

        <div className="feature-cards">
          <div className="feature-card">
            <span>🥗</span>
            <h3>Browse the Menu</h3>
            <p>Explore available meals and prices in one place.</p>
          </div>

          <div className="feature-card">
            <span>⏱️</span>
            <h3>Know Your Wait</h3>
            <p>See an estimated preparation time for your order.</p>
          </div>

          <div className="feature-card">
            <span>📦</span>
            <h3>Track Your Order</h3>
            <p>Follow your order until it is ready for pickup.</p>
          </div>
        </div>
      </section>

      <footer id="about">
        <h3>🍽️ CanteenFlow</h3>
        <p>Smart Canteen Order & Crowd System</p>
        <p>Made for a faster, easier campus food experience.</p>
      </footer>
    </div>
  );
}

export default Home;
