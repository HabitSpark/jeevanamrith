import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PaymentPage.css";

const CODPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleCODPaymentSuccess = () => {
    alert("✅ Payment will be collected at the time of delivery!");
    setShowReceipt(true);
  };

  const downloadReceipt = async () => {
    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`COD_Payment_Receipt_${Date.now()}.pdf`);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    navigate("/ordercon");
  };

  return (
    <div className="payment-container">
      {!showReceipt ? (
        <div className="payment-page">
          <h2>Cash on Delivery</h2>
          <p>Total Amount: ₹{amount}</p>
          <p>Your order will be delivered and payment collected at delivery.</p>
          <button onClick={handleCODPaymentSuccess}>Confirm COD Payment</button>
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
              <p><strong>Transaction ID:</strong> TXN{Date.now()}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              <p><strong>Amount:</strong> ₹{amount}</p>
              <p><strong>Status:</strong> ✅ Pending Payment at Delivery</p>

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

export default CODPayment;
