import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

// Create the context
export const CartContext = createContext();

// Create the provider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("user")));
  const saveTimeout=useRef(null);

  // Fetch cart from MongoDB when user logs in
  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser && storedUser._id) {
  //     setUser(storedUser);
  //     fetchCartFromBackend(storedUser._id);
  //   }
  // }, []);

  useEffect(()=>{
    const checkUser=()=>{
      const storedUser=JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      if(storedUser?.id||storedUser?._id){
        fetchCartFromBackend(storedUser._id || storedUser.id);
      }else{
        setCart([]); //clear cart on logout
      }
    };

    //listen to storege change in same tab
    window.addEventListener('storage',checkUser);

    //also check on mount
    checkUser();

    return ()=>{
      window.removeEventListener("storage",checkUser);
    };
  },[]);

  // Fetch cart manually from backend
  const fetchCartFromBackend = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/cart/${userId}`);
      const items = response.data?.items || [];
      const mappedItems = items.map(item => ({
        ...item,
        id: item.productId,  // 👈 Add id field so frontend works
      }));
      setCart(mappedItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };


    // Save cart to MongoDB
    const saveCartToBackend = async (updatedCart) => {
      if (!user || !user._id) return;
      try {
        await axios.post(`http://localhost:3001/api/cart/${user._id}`, {
          items: updatedCart,
        });
      } catch (err) {
        console.error("Failed to save cart:", err);
      }
    };
  

  // Save cart to backend when cart changes
  useEffect(() => {
    if (!user || !user._id) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveCartToBackend(cart);
    }, 500);
  }, [cart]);




  // Add to cart
// Add to cart
const addToCart = (product) => {
  setCart((prevCartItems) => {
    const existingItem = prevCartItems.find((item) => item._id === product._id || item.id === product._id);

    if (existingItem) {
      return prevCartItems.map((item) =>
        (item._id === product._id || item.id === product._id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prevCartItems, { ...product, quantity: 1 }];
    }
  });
};


  // Remove from cart
  const removeFromCart = (productId) => {
    setCart((prevCartItems) =>
      prevCartItems.filter((item) => (item._id || item.id) !== productId)
    );
  };
  const increaseQuantity = (productId) => {
    setCart((prevCartItems) =>
      prevCartItems.map((item) =>
        (item._id === productId || item.id === productId)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCart((prevCartItems) =>
      prevCartItems.map((item) =>
        (item._id === productId || item.id === productId)
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } // quantity can't go below 1
          : item
      )
    );
  };


  // const clearCart = () => setCart([]);

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
        // clearCart,
        fetchCartFromBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
