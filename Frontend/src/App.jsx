          import { useEffect, useState } from "react";
import "./App.css";

// Use the Nginx proxy in Kubernetes instead of localhost:5000
const API_URL = "/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  // GET ALL PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch products"
        );
      }

      setProducts(result.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // LOAD PRODUCTS WHEN THE PAGE OPENS
  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE FORM INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ADD PRODUCT
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create product"
        );
      }

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
      });

      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to create product");
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete product"
        );
      }

      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  // EDIT PRODUCT
  const handleEdit = async (product) => {
    const name = window.prompt(
      "Enter product name:",
      product.name
    );

    if (name === null) return;

    const price = window.prompt(
      "Enter product price:",
      String(product.price)
    );

    if (price === null) return;

    const category = window.prompt(
      "Enter category:",
      product.category || ""
    );

    if (category === null) return;

    const description = window.prompt(
      "Enter description:",
      product.description || ""
    );

    if (description === null) return;

    if (!name.trim() || price.trim() === "" || Number(price) < 0) {
      setError("Enter a valid product name and non-negative price.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update product"
        );
      }

      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to update product");
    }
  };

  // USER INTERFACE
  return (
    <div className="app">
      <header className="header">
        <h1>MERN Product Management</h1>
        <p>React + Node.js + MongoDB Atlas</p>
      </header>

      <main className="container">
        {/* ADD PRODUCT FORM */}
        <section className="form-section">
          <h2>Add Product</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="any"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="add-button"
            >
              Add Product
            </button>
          </form>
        </section>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {/* PRODUCTS LIST */}
        <section className="products-section">
          <h2>Products</h2>

          {loading && <p>Loading products...</p>}

          {!loading && !error && products.length === 0 && (
            <p className="empty">No products found.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <article
                  className="product-card"
                  key={product._id}
                >
                  <h3>{product.name}</h3>

                  <p>
                    <strong>Price:</strong>{" "}
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {product.category || "Uncategorized"}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {product.description || "No description"}
                  </p>

                  <div className="product-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;