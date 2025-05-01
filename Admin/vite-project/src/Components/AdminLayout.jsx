import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  return (
    <div className="admin-container"> {/* <-- New wrapper class */}
      <div className="admin-dashboard">
        
        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
          <div className="logo">Admin Panel</div>
          <nav>
            <ul>
              <li>
                <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/customers" onClick={() => setSidebarOpen(false)}>
                  Customers
                </Link>
              </li>
              <li>
                <Link to="/admin/products" onClick={() => setSidebarOpen(false)}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/admin/delivery" onClick={() => setSidebarOpen(false)}>
                  Delivery System
                </Link>
              </li>
              <li>
                <Link to="/admin/logs" onClick={() => setSidebarOpen(false)}>
                  Purches History
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`content ${sidebarOpen ? 'sidebar-active' : ''}`}>
          <header className="header">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </header>
          <div className="main-content">
            <h1>Welcome To the Admin Panel</h1>
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
