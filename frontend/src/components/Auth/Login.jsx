import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();
  const forgotPasswordDialog = useRef(null);

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://jeevanamrith-onmb.vercel.app/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/main');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to user's email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://jeevanamrith-onmb.vercel.app/api/users/send-otp', { email });
      if (response.data.message === "OTP sent successfully") {
        setOtpSent(true);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Reset password after OTP verification
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://jeevanamrith-onmb.vercel.app/api/users/reset-password', {
        email,
        otp,
        newPassword
      });

      if (response.data.message === "Password reset successful") {
        alert('Password reset successful! Please login.');
        setOtpSent(false);
        setEmail('');
        setOtp('');
        setNewPassword('');
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgotPassword = () => {
    setEmail('');
    setOtp('');
    setNewPassword('');
    setError('');
    setOtpSent(false);
    forgotPasswordDialog.current.showModal();
  };

  const handleCloseForgotPassword = () => {
    forgotPasswordDialog.current.close();
    setEmail('');
    setOtp('');
    setNewPassword('');
    setOtpSent(false);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="forgot-link">
            <span onClick={handleOpenForgotPassword} style={{ cursor: 'pointer', color: 'blue' }}>
              Forgot Password?
            </span>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>

      {/* Forgot Password Dialog */}
      <dialog ref={forgotPasswordDialog} className="forgot-password-dialog">
        <h3>Forgot Password</h3>
        <form onSubmit={otpSent ? handleResetPassword : handleSendOtp} className="login-form">
          <div className="form-group">
            <label>Registered Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="form-input"
              required
            />
          </div>

          {otpSent && (
            <>
              <div className="form-group">
                <label>OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input"
                  required
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? (otpSent ? 'Resetting Password...' : 'Sending OTP...')
              : (otpSent ? 'Reset Password' : 'Send OTP')}
          </button>

          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="login-button"
              onClick={handleCloseForgotPassword}
              style={{ backgroundColor: 'grey' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Login;
