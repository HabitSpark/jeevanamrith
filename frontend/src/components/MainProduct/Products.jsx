import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import { CartContext } from "./cartContext";
import axios from "axios";
import bgvideo from "./../../assets/vd-bg.mp4";
import { 
  FaHome,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSearch,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Products = () => {
  const { addToCart, cart } = useContext(CartContext);
  const [productGroups, setProductGroups] = useState({
    beauty: [],
    skin: [],
    child: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef(null);

  // Calculate totalItems here, before the return statement
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          productsArray = Object.values(response.data);
        }

        // Initialize groups
        const groups = {
          beauty: [],
          skin: [],
          child: [],
          other: []
        };

        productsArray.forEach(product => {
          if (!product || !product.category) {
            console.warn("Invalid product data:", product);
            return;
          }

          const category = product.category.toLowerCase();
          
          if (category.includes("skin") || category.includes("dermo") || category.includes("aler")) {
            groups.skin.push(product);
          } 
          else if (category.includes("child") || category.includes("kids") || category.includes("pedi")) {
            groups.child.push(product);
          }
          else if (category.includes("beauty") || category.includes("multhani") || category.includes("hair")) {
            groups.beauty.push(product);
          }
          else {
            groups.other.push(product);
          }
        });

        setProductGroups(groups);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (query) => {
    if (!query) {
      fetchProducts(); // Agar empty search ho toh sab products dikha do
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:3001/api/products/search?q=${query}`);
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Purana timeout clear
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch(query);
    }, 500); // 500ms ke baad search karega
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
    setShowResults(false);
  };

  const renderProducts = (items, title, subtitle) => (
    <div className="cart-content">
      <div className="containerr">
        <h4 className="product-title">{title}</h4>
        {subtitle && <span className="product-comments">{subtitle}</span>}
      </div>
      {items.map((product) => (
        <div className="product" key={product._id}>
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p className="category">{product.subCategory || product.category}</p>
          <p className="price">₹ {product.price}</p>
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo"> 𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕄𝕣𝕚𝕥 </div>
        </div>
        
        {/* Search Bar */}
        <div className="nav-search-container">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowResults(true)}
          />
          <FaSearch className="search-icon-button" onClick={handleSearch} />
          {showResults && searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((item) => (
                <li key={item._id} onClick={() => handleSuggestionClick(item)}>
                  {item.name}
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

      <div className="containerrr">
        <video src={bgvideo} autoPlay muted loop className="video" />
        <br />

        {/* Beauty Products */}
        {productGroups.beauty.length > 0 && (
          <>
            <div className="ayurveda-divider">
              <span className="ayurveda-text">
                "Nature's Touch for Eternal Health 🌿"
              </span>
            </div>
            {renderProducts(productGroups.beauty, "Beauty Products", "Traditional Ayurvedic beauty solutions")}
          </>
        )}

        {/* Skin Care Products */}
        {productGroups.skin.length > 0 && (
          <>
            <div className="ayurveda-divider">
              <span className="ayurveda-text">
                "Nature's Touch for Eternal Health 🌿"
              </span>
            </div>
            {renderProducts(productGroups.skin, "Skin Care", "Natural solutions for healthy skin")}
          </>
        )}

        {/* Child Care Products */}
        {productGroups.child.length > 0 && (
          <>
            <div className="ayurveda-divider">
              <span className="ayurveda-text">
                "Nature's Touch for Eternal Health 🌿"
              </span>
            </div>
            {renderProducts(productGroups.child, "Child Care", "Gentle Ayurvedic care for children")}
          </>
        )}

        {/* Other Products */}
        {productGroups.other.length > 0 && (
          <>
            <div className="ayurveda-divider">
              <span className="ayurveda-text">
                "Nature's Touch for Eternal Health 🌿"
              </span>
            </div>
            {renderProducts(productGroups.other, "Other Products", "Additional Ayurvedic remedies")}
          </>
        )}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
            <h2>{selectedProduct.name}</h2>
            <p className="modal-category">{selectedProduct.subCategory || selectedProduct.category}</p>
            <p className="modal-price">₹ {selectedProduct.price}</p>
            <button 
              className="add-to-cart-btn"
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null); // Close modal after adding
              }}
            >
              Add to Cart
            </button>
            <button 
              className="close-modal-btn" 
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
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

export default Products;
