import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-emoji">🍽️</span>
            <h3>CanteenFlow</h3>
          </div>
          <p className="footer-tagline">
            Smart College Canteen Order & Crowd Management System. Say goodbye to long campus queues
            and enjoy fresh food ready when you arrive.
          </p>
          <div className="system-pill">
            <span className="live-pulse"></span>
            <span>Real-time Live Kitchen & Queue</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Today's Menu</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/track">Track Live Order</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Canteen Hours</h4>
          <ul className="footer-info">
            <li><strong>Mon – Fri:</strong> 7:30 AM – 7:00 PM</li>
            <li><strong>Saturday:</strong> 8:00 AM – 4:00 PM</li>
            <li><strong>Sunday:</strong> Closed (Hostel Mess open)</li>
            <li><strong>Pickup Counter:</strong> Counter #1 to #3</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Staff Portal</h4>
          <p className="staff-info">
            Authorized canteen administrators can manage inventory, crowd queues, and real-time order states.
          </p>
          <Link to="/admin/login" className="footer-staff-btn">
            Admin Staff Access →
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CanteenFlow — College Canteen Order & Crowd System. All rights reserved.</p>
        <p className="backend-status">
          Powered by Spring Boot 21 REST API & Aiven Cloud MySQL
        </p>
      </div>
    </footer>
  );
}

export default Footer;
