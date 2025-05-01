import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "./cartContext";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method); // Store selected payment method
  };

  const handleConfirmPayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user._id) {
      alert("You must be logged in to place an order.");
      return;
    }
    
    // Ask for confirmation using alert
    const confirmPayment = window.confirm(
      `Do you want to proceed with ${paymentMethod.replace("-", " ")} payment?`
    );
    
    if (!confirmPayment) {
      alert("❌ Payment was cancelled. No order has been placed.");
      return;
    }
    
    // Store order data in the database if payment is confirmed
    try {
      const response = await axios.post("http://localhost:3001/api/purchase/place", {
        userId: user._id,
        items: cart,
        shippingAddress: shipping,
        paymentMethod,
        totalAmount: totalPrice,
      });
      
      // Handle different payment methods
      if (paymentMethod === "upi") {
        alert("Redirecting to UPI payment...");
        navigate("/upi-payment", {
          state: { totalAmount: totalPrice, cartItems: cart, orderId: response.data.orderId },
        });
      } else if (paymentMethod === "credit-card") {
        alert("Redirecting to Credit Card payment...");
        navigate("/credit-card-payment", {
          state: { totalAmount: totalPrice, cartItems: cart, orderId: response.data.orderId },
        });
      } else if (paymentMethod === "net-banking") {
        alert("Redirecting to Net Banking payment...");
        navigate("/net-banking-payment", {
          state: { totalAmount: totalPrice, cartItems: cart, orderId: response.data.orderId },
        });
      } else if (paymentMethod === "cod") {
        alert("✅ Order placed with Cash on Delivery! Thank you.");
        navigate("/cod", {
          state: { totalAmount: totalPrice, cartItems: cart, orderId: response.data.orderId },
        });
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("❌ Failed to place order. Please try again.");
    }
  };
  
  
  

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {/* Order Summary */}
      <div className="checkout-section order-summary">
        <h3>🛒 Your Order</h3>
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item._id || item.id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Qty: {item.quantity}</p>
                <p>₹ {item.price * item.quantity}</p>
              </div>
            </div>
          ))
        )}
        <div className="order-total">
          <h4>Total: ₹ {totalPrice}</h4>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="checkout-section shipping-address">
        <h3>🚚 Shipping Info</h3>
        <form className="shipping-form">
          <input name="fullName" placeholder="Full Name" onChange={handleInputChange} required />
          <input name="addressLine1" placeholder="Address Line 1" onChange={handleInputChange} required />
          <input name="addressLine2" placeholder="Address Line 2" onChange={handleInputChange} />
          <input name="city" placeholder="City" onChange={handleInputChange} required />
          <input name="state" placeholder="State" onChange={handleInputChange} required />
          <input name="postalCode" placeholder="Postal Code" onChange={handleInputChange} required />
          <input name="country" placeholder="Country" onChange={handleInputChange} required />
        </form>
      </div>

      {/* Payment Method */}
      <div className="checkout-section payment-method">
  <h3>💳 Payment Method</h3>
  <div className="payment-options">
    {["credit-card", "upi", "net-banking", "cod"].map((method) => (
      <label key={method} className="payment-option">
        <input
          type="radio"
          name="payment"
          value={method}
          checked={paymentMethod === method}
          onChange={() => handlePaymentSelection(method)}
        />
        {/* Icon and Text */}
        <span className="payment-icon-text">
          {method === "credit-card" && <>💳 Credit Card</>}
          {method === "upi" && <>📱 UPI</>}
          {method === "net-banking" && <>🏦 Net Banking</>}
          {method === "cod" && <>💵 Cash on Delivery</>}
        </span>
      </label>
    ))}
  </div>
</div>


      {/* Place Order Button */}
      <button className="place-order-btn" onClick={handleConfirmPayment}>
        Place Order
      </button>

      {/* Back to Cart */}
      <Link to="/cart" className="back-to-cart-link">
        ← Back to Cart
      </Link>
    </div>
  );
};

export default Checkout;
