import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Main from "./components/MainProduct/Main";
import Products from "./components/MainProduct/Products";
import Signup from "./components/Auth/Singup";
import WellnessTips from "./components/MainProduct/WellnessTips";
import Cart from "./components/MainProduct/Cart";
import  CartProvider  from "./components/MainProduct/cartContext";
import Checkout from "./components/MainProduct/Checkout";
import OrderConfirmation from "./components/MainProduct/OrderConfirmation";
import ProfilePage from "./components/MainProduct/ProfilePage";
import UPIPayment from "./components/MainProduct/UPIPayment";
import CreditCardPayment from "./components/MainProduct/CreditCardPayment";
import NetBankingPayment from "./components/MainProduct/NetBankingPayment";
import CODPayment from "./components/MainProduct/CODPayment";
// import Signup from "./components/Auth/Signup";  // Fixed spelling from Singup to Signup
// import Main from "./components/MainProduct/Homes";

const AppLayout = () => {
  const location = useLocation();

  // Hide Navbar on Login and Signup pages
  const hideNavbarPaths = ["/login", "/signup", "/main", "/products", "/tips","/cart","/profile","/checkout",];
  // const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <CartProvider>
        {/* {shouldShowNavbar && <Navbar />} */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tips" element={<WellnessTips />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/upi-payment" element={<UPIPayment/>}/>
          <Route path="/credit-card-payment" element={<CreditCardPayment/>}/>
          <Route path="/net-banking-payment" element={<NetBankingPayment/>}/>
          <Route path="/cod" element={<CODPayment/>}/>
          <Route path="/ordercon" element={<OrderConfirmation/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          {/* <Route path="/main" element={<Main />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/about" element={<Home />} />
          <Route path="/service" element={<Home />} />
        </Routes>
      </CartProvider>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
