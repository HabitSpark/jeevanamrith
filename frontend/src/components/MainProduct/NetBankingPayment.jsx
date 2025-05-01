import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PaymentPage.css";

const NetBankingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [bankSelected, setBankSelected] = useState("");
  const [passbookNumber, setPassbookNumber] = useState("");
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

  const handleNetBankingPaymentSuccess = () => {
    if (!bankSelected || !passbookNumber.trim()) {
      alert("❌ Please select a bank and enter passbook number!");
      return;
    }
    alert("✅ Payment successful via Net Banking!");
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
    pdf.save(`NetBanking_Receipt_${Date.now()}.pdf`);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    navigate("/cart");
  };

  return (
    <div className="payment-container">
      {!showReceipt ? (
        <div className="payment-page">
          <h2>Net Banking Payment</h2>
          <p>Total Amount: ₹{amount}</p>

          <div>
            <label>Select Bank</label>
            <select
              value={bankSelected}
              onChange={(e) => setBankSelected(e.target.value)}
            >
              <option value="">Select a Bank</option>
              <option value="HDFC">HDFC</option>
              <option value="SBI">SBI</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="ICICI">ICICI</option>
            </select>
          </div>

          <div>
            <label>Passbook Number</label>
            <input
              type="text"
              value={passbookNumber}
              onChange={(e) => setPassbookNumber(e.target.value)}
              placeholder="Enter your Passbook Number"
            />
          </div>

          <button onClick={handleNetBankingPaymentSuccess}>Pay via Net Banking</button>
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
              <p><strong>Transaction ID:</strong> NB{Date.now()}</p>
              <p><strong>Payment Method:</strong> Net Banking</p>
              <p><strong>Bank:</strong> {bankSelected}</p>
              <p><strong>Passbook Number:</strong> {passbookNumber}</p>
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

export default NetBankingPayment;
