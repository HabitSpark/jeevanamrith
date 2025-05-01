import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin';
import AdminLayout from './Components/AdminLayout';
import Customers from './Components/Customers';
import Products from './Components/Products';
import Delivery from './Components/Delivery';
import PurchaseHistory from './Components/purchaseHistory';
import DeliveryDashboard from './Components/DeliveryDashboard';

// Protect Admin Routes
const AdminRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? element : <Navigate to="/" />;
};

// Protect Delivery Boy Routes
const DeliveryBoyRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('deliveryBoyAuth') === 'true';
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page for Admin and Delivery Boy */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="logs" element={<PurchaseHistory />} />
        </Route>

        {/* Delivery Boy Dashboard */}
        <Route
          path="/deliveryDash"
          element={<DeliveryBoyRoute element={<DeliveryDashboard />} />}
        />

        {/* Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
