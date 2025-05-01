import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "./cartContext";
import "./Profile.css";
import { jsPDF } from "jspdf"; // Import jsPDF

import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSearch,
} from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "" });
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id;

        if (!userId) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get(
          `http://localhost:3001/api/profile/${userId}`
        );
        setUser(userResponse.data);
        setUpdatedUser({
          name: userResponse.data.name,
          email: userResponse.data.email,
        });
        setPreview(userResponse.data.profilePicture || "");

        const historyResponse = await axios.get(
          `http://localhost:3001/api/purchase/user/${userId}`
        );
        setPurchaseHistory(historyResponse.data);
      } catch (error) {
        console.error("Error fetching user or purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndHistory();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image || !user?._id) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Image = await toBase64(image);

      const response = await axios.put(
        `http://localhost:3001/profile/${user._id}/picture`,
        { imageUrl: base64Image }
      );

      setUser(response.data);
      setPreview(base64Image);
      setImage(null);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to update profile picture");
    }
  };

  const removeImage = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.delete(
        `http://localhost:3001/profile/${user._id}/picture`
      );
      setUser(response.data);
      setPreview("");
      alert("Profile picture removed");
    } catch (err) {
      console.error("Error removing image:", err);
      alert("Failed to remove profile picture");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/profile/${user._id}`,
        updatedUser
      );
      setUser(response.data);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update profile");
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const downloadReceipt = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("JeevanAmrit - Order Receipt 🧾", 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${user.name}`, 14, 30);
    doc.text(`Customer Email: ${user.email}`, 14, 40);
    doc.text(`Order ID: ${order._id}`, 14, 50);
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, 60);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, 70);
    doc.text(`Order Date: ${formatDate(order.createdAt)}`, 14, 80);

    let y = 90; // Start of items list
    doc.text("Purchased Items:", 14, y);
    y += 10;
    order.items.forEach((item) => {
      doc.text(
        `• ${item.name} (Qty: ${item.quantity}) - ₹${
          item.price * item.quantity
        }`,
        14,
        y
      );
      y += 10;
    });

    doc.text("Thank you for shopping with us! 🌿", 14, y + 10);

    doc.save(`JeevanAmrit_Receipt_${order._id}.pdf`);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>
        </div>
        <div className="nav-search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." className="nav-search" />
        </div>
        <ul className="nav-links">
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

      <div className="profile-container">
        <h2>My Profile</h2>

        <div className="profile-picture-section">
          <div className="picture-container">
            {preview ? (
              <img src={preview} alt="Profile" className="profile-picture" />
            ) : (
              <div className="default-picture">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="picture-controls">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="profile-upload" className="upload-btn">
              Choose Image
            </label>

            {image && (
              <button onClick={uploadImage} className="save-btn">
                Save Picture
              </button>
            )}

            {user.profilePicture && !image && (
              <button onClick={removeImage} className="remove-btn">
                Remove Picture
              </button>
            )}
          </div>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="label">Name:</span>
            {editMode ? (
              <input
                type="text"
                value={updatedUser.name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, name: e.target.value })
                }
              />
            ) : (
              <span className="value">{user.name || "Not available"}</span>
            )}
          </div>

          <div className="info-row">
            <span className="label">Email:</span>
            {editMode ? (
              <input
                type="email"
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
              />
            ) : (
              <span className="value">{user.email || "Not available"}</span>
            )}
          </div>

          <div className="info-row">
            <span className="label">Member Since:</span>
            <span className="value">{formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Purchase History */}
        <div className="purchase-history">
          <h3>Purchase History</h3>
          {purchaseHistory.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            <div className="order-list">
              {purchaseHistory.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-details">
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Total: ₹ {order.totalAmount}</p>
                    <p>Order Date: {formatDate(order.createdAt)}</p>
                    <p>
                      Delivery Status: {order.deliveryStatus || "Pending"}
                    </p>{" "}
                    {/* ➡️ new line */}
                    {/* Download Receipt Button */}
                    <button
                      className="download-receipt-btn"
                      onClick={() => downloadReceipt(order)}
                    >
                      📥 Download Receipt
                    </button>
                  </div>
                  <div className="order-products">
                    {order.items.map((item) => (
                      <div key={item._id} className="order-product">
                        <img src={item.image} alt={item.name} />
                        <p>
                          {item.name} - Qty: {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        {/* {!editMode && (
          <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
        )}
        {editMode && (
          <button onClick={handleUpdateUser} className="save-btn">Save Changes</button>
        )} */}
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

export default ProfilePage;
