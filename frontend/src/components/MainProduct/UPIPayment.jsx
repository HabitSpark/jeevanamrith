import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PaymentPage.css";

const UPIPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {}; // Fetch user from localStorage

  useEffect(() => {
    const { totalAmount, cartItems } = location.state || {};
    if (totalAmount) {
      setAmount(totalAmount);
      setCartItems(cartItems);
    } else {
      alert("❌ Failed to fetch order details.");
    }
  }, [location]);

  const handleUPIPaymentSuccess = () => {
    if (!upiId.trim()) {
      alert("Please enter a valid UPI ID!");
      return;
    }
    alert("✅ Payment successful via UPI!");
    setShowReceipt(true); // Show receipt after successful payment
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
    pdf.save(`Payment_Receipt_${Date.now()}.pdf`);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    navigate("/cart");
  };

  return (
    <div className="payment-container">
      {!showReceipt ? (
        <div className="payment-page">
          <h2>UPI Payment</h2>
          <p className="amount-info">Total Amount: ₹{amount}</p>

          <div>
            <label>Enter UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g., example@upi"
            />
          </div>

          <button onClick={handleUPIPaymentSuccess}>Pay with UPI</button>
        </div>
      ) : (
        <div className="receipt-popup">
          <div className="receipt-content" ref={receiptRef}>
            {/* Beautiful JeevanAmrit Logo Heading */}
            <div className="receipt-header">
              <h1 className="brand-logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</h1>
              <h2>🧾 Payment Receipt</h2>
            </div>

            <div className="receipt-body">
              <p><strong>Name:</strong> {user.name || "Guest User"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Transaction ID:</strong> TXN{Date.now()}</p>
              <p><strong>Payment Method:</strong> UPI</p>
              <p><strong>UPI ID:</strong> {upiId}</p>
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

export default UPIPayment;
