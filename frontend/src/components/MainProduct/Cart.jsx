import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "./cartContext"; // Import CartContext
import "./Cart.css"; // Import CSS for the cart page
import bgvideo from "./../../assets/vd-bg.mp4"; // Import background video

// Import FontAwesome icons
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSearch,
} from "react-icons/fa";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useContext(CartContext);

  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state
  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        setCheckoutError("User not found. Please login.");
        console.error("User not found");
        return;
    }

    if (cart.length === 0) {
        setCheckoutError("Your cart is empty!");
        console.error("Cart is empty");
        return;
    }

    try {
        setIsProcessing(true);
        const response = await axios.post("http://localhost:3001/api/orders/checkout", {
            userId: user._id,
            cartItems: cart.map(item => ({
                productId: item._id || item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalPrice,
            shippingAddress: {
                address: user.address || "Default Address",
                city: user.city || "Default City",
                zip: user.zip || "000000"
            },
            paymentMethod: "Cash on Delivery"
        });

        console.log("Order placed successfully:", response.data);
        setIsProcessing(false);
        navigate("/checkout");
    } catch (error) {
        console.error("Checkout error:", error);
        setCheckoutError("Checkout failed. Please try again later.");
        setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>
        </div>

        {/* Search Bar */}
        <div className="nav-search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." className="nav-search" />
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

      {/* Background Video */}
      <div className="video-container">
        <video src={bgvideo} autoPlay muted loop className="video" />
      </div>

      {/* Cart Content */}
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>
            Your cart is empty. <Link to="/products">Start shopping!</Link>
          </p>
        ) : (
          <>
            <div className="cart-items">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div className="cart-item" key={item.id || item._id || index}>
                    <img
                      src={item.image || "default-image.jpg"}
                      alt={item.name || "Product"}
                    />
                    <div className="item-details">
                      <h3>{item.name || "Unnamed Product"}</h3>
                      <p>₹ {item.price ? item.price.toFixed(2) : "N/A"}</p>

                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(item._id || item.id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item._id || item.id)}>
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id || item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-cart">Your cart is empty.</p>
              )}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>

              {checkoutError && (
                <div className="checkout-error">{checkoutError}</div>
              )}

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>

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

export default Cart;
