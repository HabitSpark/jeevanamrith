import React, { useEffect, useState } from 'react';
import './Customer.css';
import axios from 'axios';

const Customers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Get all users
        const { data: users } = await axios.get('http://localhost:3001/api/users');

        // Get each user's purchases using user._id
        const usersWithPurchases = await Promise.all(
          users.map(async (user) => {
            try {
              // Fetch purchases for the user using user._id
              const { data: purchases } = await axios.get(`http://localhost:3001/api/purchases/${user._id}`);
              return { ...user, purchases };
            } catch (err) {
              console.error(`Couldn't fetch purchases for ${user.name}`, err);
              return { ...user, purchases: [] };
            }
          })
        );

        setUsers(usersWithPurchases);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="customer-container">
      <h2>Customer List</h2>

      {users.length === 0 ? (
        <p>Loading customers...</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="customer-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Customers;
