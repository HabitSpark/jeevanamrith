import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminTables.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Delivery = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDeliveryBoy, setNewDeliveryBoy] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [boysRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3001/api/delivery"),
        axios.get("http://localhost:3001/api/purchase/all"),
      ]);

      setDeliveryBoys(boysRes.data);

      // Correct handling of orders data
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.orders || []);
      setOrders(ordersData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryBoy = async (e) => {
    e.preventDefault();

    if (!newDeliveryBoy.name || !newDeliveryBoy.email || !newDeliveryBoy.phone || !newDeliveryBoy.vehicle) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/delivery",
        newDeliveryBoy
      );
      toast.success("Delivery boy added!");
      setNewDeliveryBoy({ name: "", email: "", phone: "", vehicle: "" });
      fetchData();
    } catch (error) {
      console.error(
        "Error adding delivery boy:",
        error.response ? error.response.data : error
      );
      toast.error(error.response?.data?.message || "Error adding delivery boy");
    }
  };

  const handleAssign = async (orderId, deliveryBoyId) => {
    try {
      await axios.put(`http://localhost:3001/api/purchase/${orderId}/assign`, {
        deliveryBoyId,
      });
      toast.success("Order assigned successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign order");
    }
  };

  // Filter orders based on deliveryStatus = "pending"
  const pendingOrders = orders.filter(
    (order) => order.deliveryStatus?.toLowerCase() === "pending"
  );

  return (
    <div className="admin-table-container">
      <ToastContainer />
      <h2 className="page-title">🚚 Delivery Management</h2>

      {/* Add Delivery Boy */}
      <div className="delivery-section">
        <h3>Add Delivery Personnel</h3>
        <form onSubmit={handleAddDeliveryBoy} className="add-delivery-form">
          {["name", "email", "phone", "vehicle"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newDeliveryBoy[field]}
              onChange={(e) =>
                setNewDeliveryBoy({
                  ...newDeliveryBoy,
                  [field]: e.target.value,
                })
              }
              required
            />
          ))}
          <button type="submit" className="primary-btn">
            Add
          </button>
        </form>
      </div>

      {/* Delivery Boy List */}
      <div className="delivery-section">
        <h3>Registered Delivery Personnel</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Assigned Orders</th>
              </tr>
            </thead>
            <tbody>
              {deliveryBoys.map((boy, index) => (
                <tr key={boy._id}>
                  <td>{index + 1}</td>
                  <td>{boy.name}</td>
                  <td>{boy.email}</td>
                  <td>{boy.phone}</td>
                  <td>{boy.vehicle}</td>
                  <td>
                    {boy.assignedOrders && boy.assignedOrders.length > 0 ? (
                      <ul>
                        {boy.assignedOrders.map((order) => (
                          <li key={order._id}>
                            Order: #{order._id.slice(-6)} | Customer:{" "}
                            {order.userId?.name || "Unknown"} | Total: ${order.totalAmount}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "0"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending Orders */}
      <div className="delivery-section">
        <h3>Pending Orders</h3>
        {loading ? (
          <p>Loading...</p>
        ) : pendingOrders.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Assign To</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6)}</td>
                  <td>{order.userId?.name || "N/A"}</td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className="status-badge pending">Pending</span>
                  </td>
                  <td>
                    <select
                      onChange={(e) => handleAssign(order._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select delivery boy
                      </option>
                      {deliveryBoys.map((boy) => (
                        <option key={boy._id} value={boy._id}>
                          {boy.name} ({boy.vehicle})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Delivery;
