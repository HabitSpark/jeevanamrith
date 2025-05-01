import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {}; // Getting orderId from navigation
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null; // Real userId from localStorage

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !userId) {
        // navigate("/"); // If no orderId or userId, redirect to home
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        setOrder(res.data); // Save order details
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchOrderDetails();
  }, [orderId, userId, navigate]);

  const downloadReceipt = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) return;

    const canvas = await html2canvas(receiptElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`OrderReceipt_${order._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="order-confirmation">
        <h2>Loading your order details...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <h2>Order not found ❌</h2>
        <p>Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <h2>🎉 Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>

      {/* Receipt Section */}
      <div className="order-details" ref={receiptRef}>
        <h3>🧾 Order Receipt</h3>

        <p><strong>Order ID:</strong> #{order._id}</p>
        <p><strong>Total Amount:</strong> ₹ {order.totalAmount}</p>

        <h4>Products:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - Qty: {item.quantity} - ₹ {item.price * item.quantity}
            </li>
          ))}
        </ul>

        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
      </div>

      {/* Download Button */}
      <button onClick={downloadReceipt} className="download-receipt-btn">
        📥 Download Receipt (PDF)
      </button>
    </div>
  );
};

export default OrderConfirmation;
