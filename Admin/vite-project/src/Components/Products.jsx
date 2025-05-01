import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Product.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        stock: ''
    });
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (editingProductId) {
                // Update product
                response = await axios.put(`http://localhost:3001/api/products/${editingProductId}`, newProduct);
            } else {
                // Create new product
                const generatedProductId = Math.floor(100000 + Math.random() * 900000); // ⭐ Yahan ID generate ho rahi
                response = await axios.post('http://localhost:3001/api/products', {
                    ...newProduct,
                    productId: generatedProductId, // ID send karna
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            console.log(response.data);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error.response ? error.response.data : error.message);
        }
    };

    const resetForm = () => {
        setNewProduct({
            name: '',
            category: '',
            price: '',
            description: '',
            image: '',
            stock: ''
        });
        setEditingProductId(null);
    };

    const handleEditProduct = (product) => {
        const { productId, ...rest } = product; // Remove productId when editing
        setNewProduct(rest);
        setEditingProductId(product._id);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="product-container">
            <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>

            <form onSubmit={handleAddOrUpdateProduct}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div>
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={newProduct.image}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">{editingProductId ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h2>Product List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
