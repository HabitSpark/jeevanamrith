import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://jeevanamrith-onmb.vercel.app/users', { name, email, password })
      .then(result => {
        console.log(result);
        alert('Registration successful! You can now login.'); // Success alert
        navigate("/login");
      })
      .catch(error => {
        console.log(error);
        // Error alert with server message or generic message
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        alert(`Error: ${errorMessage}`);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete='off'
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <div className="login-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
