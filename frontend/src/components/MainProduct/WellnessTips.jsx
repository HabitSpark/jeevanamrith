import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./WellnessTips.css";
import {
  FaLeaf,
  FaHeartbeat,
  FaSmile,
  FaMedkit,
  FaHome,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSearch,
  FaShieldAlt,
  FaWater,
  FaBars,
  FaTimes
} from "react-icons/fa";
import bgvideo from "./../../assets/vd-bg.mp4";
import { CartContext } from "./cartContext";

const WellnessTips = () => {
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const tips = [
    {
      id: 1,
      icon: <FaLeaf className="tip-icon" />,
      title: "Embrace Nature",
      description:
        "Spending time outdoors is one of the best ways to reduce stress and improve mental health. Nature has a calming effect on the mind and body, helping to lower cortisol levels and boost mood. Make it a habit to spend at least 30 minutes outside every day.",
    },
    {
      id: 2,
      icon: <FaWater className="tip-icon" />,
      title: "Stay Hydrated",
      description:
        "Drinking plenty of water keeps your body hydrated, flushes out toxins, and supports healthy skin and digestion. Start your day with a glass of warm water with lemon for detox benefits.",
    },
    {
      id: 3,
      icon: <FaHeartbeat className="tip-icon" />,
      title: "Daily Pranayama",
      description:
        "Practice deep breathing and pranayama every morning to increase oxygen flow, reduce stress, and support lung health. Just 10 minutes can improve your mental clarity and calm your nervous system.",
    },
    {
      id: 4,
      icon: <FaMedkit className="tip-icon" />,
      title: "Herbal Immunity Boosters",
      description:
        "Incorporate Ayurvedic herbs like Tulsi, Amla, and Giloy into your diet. These natural boosters enhance your immunity and protect you from common infections.",
    },
    {
      id: 6,
      icon: <FaShieldAlt className="tip-icon" />,
      title: "Protect Your Energy",
      description:
        "Limit your exposure to negativity—both digitally and socially. Surround yourself with uplifting content and positive people for better emotional resilience.",
    },
  ];
  

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/products/search?q=${searchTerm}`
      );
      const data = await res.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <>
      <video src={bgvideo} autoPlay muted loop className="video" />

      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>
        </div>

        {/* Search Bar */}
        <div className="nav-search-container">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          <FaSearch className="search-icon-button" onClick={handleSearch} />
          {showResults && searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((item) => (
                <li key={item._id}>
                  <Link to={`/products/${item._id}`}>{item.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navbar Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/main">
              <FaHome className="icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/products">
              <FaBoxOpen className="icon" /> Products
            </Link>
          </li>
          <li>
            <Link to="/tips">
              <FaBoxOpen className="icon" /> Wellness Tips
            </Link>
          </li>
          <li>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart className="icon" /> Cart
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </Link>
          </li>
          <li className="profile-dropdown">
            <FaUser className="profile-icon" />
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                Logout
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Wellness Tips Content (keep this part exactly the same) */}
      <div className="wellness-tips-container">
        <header className="wellness-header">
          <h1>Wellness Tips for a Healthier You</h1>
          <p>Discover simple yet effective ways to improve your well-being.</p>
        </header>

        <div className="tips-grid">
          {tips.map((tip) => (
            <div className="tip-card" key={tip.id}>
              <div className="tip-icon-container">{tip.icon}</div>
              <h2 className="tip-title">{tip.title}</h2>
              <p className="tip-description">{tip.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h2>Start Your Wellness Journey Today!</h2>
          <p>
            Explore our range of Ayurvedic products to support your health and
            well-being.
          </p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Footer (keep this part exactly the same) */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <h2>JeevanAmrit - The Essence of Ayurveda</h2>
            <p>
              At JeevanAmrit, we bring you **authentic Ayurvedic medicines**
              made from **pure herbal ingredients** to enhance your **health,
              immunity, and well-being**. Our products follow the ancient wisdom
              of Ayurveda for **holistic healing**.
            </p>
          </div>
          <div className="footer-links">
            <h3>Our Herbal Remedies</h3>
            <ul>
              <li>🌿 Ashwagandha - Stress & Energy Booster</li>
              <li>🌿 Triphala - Digestive & Detox Formula</li>
              <li>🌿 Brahmi - Brain & Memory Enhancer</li>
              <li>🌿 Tulsi - Immune & Respiratory Support</li>
              <li>🌿 Shilajit - Vitality & Strength Booster</li>
              <li>🌿 Amla - Natural Vitamin C & Antioxidant</li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: support@jeevanamrit.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <p className="footer-bottom">
          &copy; 2025 JeevanAmrit. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default WellnessTips;