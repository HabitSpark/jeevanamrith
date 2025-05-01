import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PaymentPage.css";

const CreditCardPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const { totalAmount, cartItems } = location.state || {};
    if (totalAmount && cartItems) {
      setAmount(totalAmount);
      setCartItems(cartItems);
    } else {
      alert("❌ Failed to fetch order details.");
    }
  }, [location]);

  const handlePaymentSuccess = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      alert("Please fill all card details!");
      return;
    }
    alert("✅ Payment successful via Credit Card!");
    setShowReceipt(true);
  };

  const downloadReceipt = async () => {
    const receiptElement = receiptRef.current;
    const canvas = await html2canvas(receiptElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`CreditCard_Receipt_${Date.now()}.pdf`);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    navigate("/cart");
  };

  return (
    <div className="payment-container">
      {!showReceipt ? (
        <div className="payment-page">
          <h2>Credit Card Payment</h2>
          <p>Total Amount: ₹{amount}</p>

          <div>
            <label>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div>
            <label>Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
            />
          </div>

          <button onClick={handlePaymentSuccess}>Pay with Credit Card</button>
        </div>
      ) : (
        <div className="receipt-popup">
          <div className="receipt-content" ref={receiptRef}>
            <div className="receipt-header">
              <h1 className="brand-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</h1>
              <h2>🧾 Payment Receipt</h2>
            </div>

            <div className="receipt-body">
              <p><strong>Name:</strong> {user.name || "Guest User"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Transaction ID:</strong> CARD{Date.now()}</p>
              <p><strong>Payment Method:</strong> Credit Card</p>
              <p><strong>Amount Paid:</strong> ₹{amount}</p>
              <p><strong>Status:</strong> ✅ Payment Successful</p>

              <h4>🛒 Purchased Items:</h4>
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} — Qty: {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>

              <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>

          <div className="receipt-buttons">
            <button onClick={downloadReceipt}>📥 Download Receipt</button>
            <button onClick={closeReceipt}>✅ Confirm & Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCardPayment;
