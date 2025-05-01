import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DeliveryDashboard.css";

const DeliveryDashboard = () => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedDeliveryBoy = JSON.parse(
          localStorage.getItem("deliveryBoy")
        );
        if (!storedDeliveryBoy) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/delivery/${storedDeliveryBoy.email}`
        );
        setDeliveryBoy(response.data);

        // Fetch assigned orders separately
        const ordersResponse = await axios.get(
          `http://localhost:3001/api/delivery/assigned-orders/${storedDeliveryBoy.email}`
        );
        setAssignedOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [navigate]);

  // ✅ Handle delivery done click
  const handleDeliveryDone = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/delivery/update-delivery-status/${orderId}`
      );
      if (response.status === 200) {
        alert("Delivery marked as done!");
        // Update the assigned orders after marking delivered
        fetchAssignedOrders();
      } else {
        alert("Failed to update delivery status.");
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Refetch assigned orders after delivery done
  const fetchAssignedOrders = async () => {
    try {
      const storedDeliveryBoy = JSON.parse(
        localStorage.getItem("deliveryBoy")
      );
      if (storedDeliveryBoy) {
        const ordersResponse = await axios.get(
          `http://localhost:3001/api/delivery/assigned-orders/${storedDeliveryBoy.email}`
        );
        setAssignedOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching assigned orders:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading Delivery Dashboard...</div>;
  }

  if (!deliveryBoy) {
    return <div className="error">Delivery Boy not found</div>;
  }

  return (
    <div className="delivery-dashboard">
      <h2>Welcome, {deliveryBoy.name}!</h2>

      <div className="delivery-info">
        <p>
          <strong>Name:</strong> {deliveryBoy.name}
        </p>
        <p>
          <strong>Vehicle:</strong> {deliveryBoy.vehicle}
        </p>
        <p>
          <strong>Email:</strong> {deliveryBoy.email}
        </p>
        <p>
          <strong>Phone:</strong> {deliveryBoy.phone}
        </p>
      </div>

      <div className="assigned-orders">
        <h3>Assigned Orders:</h3>
        {assignedOrders.length === 0 ? (
          <p>No assigned orders</p>
        ) : (
          <ul>
            {assignedOrders.map((order) => (
              <div key={order._id} className="order-card">
                <p>Order ID: {order._id}</p>
                <p>Status: {order.deliveryStatus}</p>

                {order.deliveryStatus !== "Delivery Done" && (
                  <button
                    className="delivery-done-button"
                    onClick={() => handleDeliveryDone(order._id)}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
