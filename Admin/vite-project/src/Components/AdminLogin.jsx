import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [userType, setUserType] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Admin Credentials');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/delivery/send-otp', { email });
      console.log(res.data);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/delivery/verify-otp', { email, otp });
      console.log(res.data);

      // Save delivery boy details directly from response
      const { deliveryBoy } = res.data;
      if (deliveryBoy) {
        // Store delivery boy details for dashboard (optional if needed)
        localStorage.setItem('deliveryBoy', JSON.stringify(deliveryBoy));

        // Navigate to dashboard
        navigate('/deliveryDash');
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h2>{userType === 'admin' ? 'Admin Login' : 'Delivery Boy Login'}</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={userType === 'admin' ? handleAdminLogin : (otpSent ? handleVerifyOtp : handleSendOtp)}>
            {userType === 'admin' ? (
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter delivery boy email"
                  />
                </div>
                {otpSent && (
                  <div className="form-group">
                    <label>OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>User Type</label>
              <select value={userType} onChange={(e) => {
                setUserType(e.target.value);
                setError('');
                setOtpSent(false);
                setUsername('');
                setPassword('');
                setEmail('');
                setOtp('');
              }}>
                <option value="admin">Admin</option>
                <option value="deliveryBoy">Delivery Boy</option>
              </select>
            </div>

            <button type="submit" className="login-button">
              {userType === 'admin' ? 'Login' : (otpSent ? 'Verify OTP' : 'Send OTP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
