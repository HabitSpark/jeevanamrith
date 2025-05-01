import React, { useEffect, useState, useRef, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import bgvideo from "./../../assets/vd-bg.mp4";
import "./homes.css";
import { CartContext } from "./cartContext";
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

import img1 from "../../assets/Product/prd1.jpg";
import img2 from "../../assets/Product/prd2.jpg";
import img3 from "../../assets/Product/prd3.jpg";
import img4 from "../../assets/Product/prd3.jpg";

import imges1 from "../../assets/Main/fungal.jpg";
import imges2 from "../../assets/Main/diabetes.jpg";
import imges3 from "../../assets/Main/joinpain-bg.jpg";
import imges4 from "../../assets/Main/lumbar-bg.jpg";

const testimonials = [
  { name: "Asha", text: "JeevanAmrit products have changed my life! Highly recommended." },
  { name: "Rajesh", text: "Excellent quality and 100% authentic Ayurvedic solutions!" },
  { name: "Pooja", text: "I feel healthier and more energetic after using their products!" },
  { name: "Suresh", text: "Best herbal products on the market! Love it!" },
  { name: "Neha", text: "Fast delivery and great packaging. Highly recommended!" },
  { name: "Varun", text: "Pure herbal ingredients that actually work!" },
  { name: "Anjali", text: "Best Ayurvedic products I have ever used!" },
  { name: "Rohit", text: "Great value for money and authentic herbal solutions!" },
];

const Main = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const { addToCart, cart } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const collections = [
    { id: 1, name: "Maharishi Ayurveda", description: "Livomap Tablets for Liver Health and Support", price: "₹664", img: img1 },
    { id: 2, name: "Khadi Natural", description: "Ayurvedic Rose & Orange Face Pack", price: "₹350", img: img2 },
    { id: 3, name: "Khadi Natural", description: "Amla & Reetha Hair Shampoo", price: "₹200", img: img3 },
    { id: 4, name: "Royal chair", description: "Amla & Reetha Hair Shampoo", price: "₹200", img: img4 },
  ];

  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const wellnessTipsRef = useRef(null);
  const cartRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0) || 0;

  // 🔥 UPDATED Search Logic
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setShowResults(false);
      return;
    }

    const filtered = collections.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  return (
    <>
      <video src={bgvideo} autoPlay muted loop className="video" />
      <div className="home">
        <nav className="navbar">
          <div className="nav-left">
            <div className="nav-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>
          </div>

          {/* Search Bar */}
          <div className="nav-search-container">
            <input
              type="text"
              placeholder="Search by name or category..."
              className="nav-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <FaSearch className="search-icon-button" onClick={handleSearch} />
          </div>

          {/* Hamburger Menu */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Navbar Links */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <NavLink
                to="#"
                onClick={() => scrollToSection(homeRef)}
              >
                <FaHome className="icon" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products">
                <FaBoxOpen className="icon" /> Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/tips">
                <FaBoxOpen className="icon" /> Wellness Tips
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                <FaShoppingCart className="icon" /> Cart
                {totalItems > 0 && (
                  <span className="cart-count">{totalItems}</span>
                )}
              </NavLink>
            </li>
            <li className="profile-dropdown">
              <FaUser className="profile-icon" />
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/profile">
                    Profile
                  </NavLink>
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

        {/* 🔥 Search Results Section */}
        {showResults && (
          <div className="search-results-container">
            {searchResults.length > 0 ? (
              <div className="collections-grid">
                {searchResults.map((item) => (
                  <div key={item.id} className="collection-item">
                    <img src={item.img} alt={item.name} className="item-image" />
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <h5 className="item-price">{item.price}</h5>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                No matching products found.
              </p>
            )}
          </div>
        )}

        {/* Rest of your page */}
        <div ref={homeRef} className="slideshow-container">
          {[imges1, imges2, imges3, imges4].map((img, index) => (
            <div className="slide fade" key={index}>
              <img src={img} alt={`Slide ${index + 1}`} />
              <div className="text-overlay">
                <h1>JeevnAmrit</h1>
                <p>Best ayurvedic products.</p>
                <button className="shop-btn" onClick={() => navigate('/Products')}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>

        <div ref={productsRef} className="home-container">
          <h2>New Launches</h2>
          <div className="collections-grid">
            {collections.map((product) => (
              <div key={product._id} className="collection-item">
                <img src={product.img} alt={product.name} className="item-image" />
                <h3 className="item-name">{product.name}</h3>
                <p className="item-description">{product.description}</p>
                <h5 className="item-price">{product.price}</h5>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div ref={wellnessTipsRef} className="ayurveda-divider">
          <span className="ayurveda-text">
            "Nature's Touch for Eternal Health 🌿"
          </span>
        </div>

        <div ref={cartRef} className="super-safe">
          <h2>
            <FaShieldAlt /> Super Safe Standards
          </h2>
          <p>
            All our products are 100% natural, organic, and approved by Ayurveda experts.
          </p>
        </div>

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
      </div>
    </>
  );
};

export default Main;
