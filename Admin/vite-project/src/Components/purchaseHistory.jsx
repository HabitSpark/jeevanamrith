import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PurchaseHistory.css';

const PurchaseHistory = () => {
  const [groupedPurchases, setGroupedPurchases] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/purchase/all");

        // Group by userId
        const groups = {};
        const uniqueUsers = [];
        const userMap = new Map();

        response.data.forEach((purchase) => {
          const userId = purchase.userId?._id;
          if (userId) {
            if (!groups[userId]) {
              groups[userId] = {
                user: purchase.userId,
                purchases: [],
              };
            }
            groups[userId].purchases.push(purchase);

            if (!userMap.has(userId)) {
              userMap.set(userId, purchase.userId);
              uniqueUsers.push(purchase.userId);
            }
          }
        });

        setGroupedPurchases(groups);
        setUsers(uniqueUsers);
      } catch (err) {
        console.error(err);
        setError('Failed to load purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div className="purchase-history-container">
      <h2>All Purchase History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 🔥 User filter dropdown */}
      <div className="filter-container">
        <label>Select User: </label>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
          <option value="all">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 Show grouped purchases */}
      {Object.keys(groupedPurchases)
        .filter(userId => selectedUserId === 'all' || userId === selectedUserId)
        .map(userId => {
          const group = groupedPurchases[userId];
          return (
            <div key={userId} className="user-purchase-group">
              <h3>User: {group.user?.name} ({group.user?.email})</h3>

              {group.purchases.map((purchase) => (
                <div key={purchase._id} className="purchase-card">
                  <h4>Purchase ID: {purchase._id}</h4>
                  <p><strong>Date:</strong> {new Date(purchase.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total Amount:</strong> ₹{purchase.totalAmount}</p>
                  <p><strong>Payment Method:</strong> {purchase.paymentMethod}</p>

                  {/* 🔥 Delivery Status */}
                  <p>
                    <strong>Delivery Status:</strong> 
                    {purchase.deliveryStatus 
                      ? <span className={`status ${purchase.deliveryStatus.toLowerCase()}`}>{purchase.deliveryStatus}</span>
                      : <span className="status pending">Pending</span>}
                  </p>

                  <div className="shipping-info">
                    <p><strong>Shipping Address:</strong> {purchase.shippingAddress?.fullName}</p>
                    <p>{purchase.shippingAddress?.addressLine1}, {purchase.shippingAddress?.city}</p>
                  </div>

                  <h5>Products:</h5>
                  <div className="product-list">
                    {purchase.items.map((item) => (
                      <div key={item.productId?._id || item._id} className="product-item">
                        <img src={item.productId?.image || '/default-product.png'} alt={item.productId?.name || 'Product'} />
                        <div>
                          <p><strong>{item.productId?.name || "Product Name"}</strong></p>
                          <p>Qty: {item.quantity}</p>
                          <p>Price: ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
};

export default PurchaseHistory;
