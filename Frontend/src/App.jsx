import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

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

  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();

      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================
  // ADD PRODUCT
  // ==========================================

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
          name: formData.name,

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

      // Clear form after successful creation

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
      });

      // Refresh product list

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete product"
        );
      }

      // Refresh product list

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = async (product) => {
    const name = window.prompt(
      "Enter product name:",
      product.name
    );

    if (name === null) {
      return;
    }

    const price = window.prompt(
      "Enter product price:",
      product.price
    );

    if (price === null) {
      return;
    }

    const category = window.prompt(
      "Enter category:",
      product.category || ""
    );

    if (category === null) {
      return;
    }

    const description = window.prompt(
      "Enter description:",
      product.description || ""
    );

    if (description === null) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${product._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,

            price: Number(price),

            category: category,

            description: description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update product"
        );
      }

      // Refresh product list

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // USER INTERFACE
  // ==========================================

  return (
    <div className="app">

      {/* ======================================
          HEADER
      ======================================= */}

      <header className="header">

        <h1>
          MERN Product Management
        </h1>

        <p>
          React + Node.js + MongoDB Atlas
        </p>

      </header>


      {/* ======================================
          MAIN CONTAINER
      ======================================= */}

      <main className="container">


        {/* ====================================
            ADD PRODUCT FORM
        ===================================== */}

        <section className="form-section">

          <h2>
            Add Product
          </h2>


          <form onSubmit={handleSubmit}>


            {/* PRODUCT NAME */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

            </div>


            {/* PRICE */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                required
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
              />

            </div>


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="add-button"
            >
              Add Product
            </button>

          </form>

        </section>


        {/* ====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (

          <div className="error">

            {error}

          </div>

        )}


        {/* ====================================
            PRODUCTS SECTION
        ===================================== */}

        <section className="products-section">

          <h2>
            Products
          </h2>


          {/* LOADING */}

          {loading && (

            <p>
              Loading products...
            </p>

          )}


          {/* EMPTY PRODUCTS */}

          {!loading &&
            !error &&
            products.length === 0 && (

              <p className="empty">
                No products found.
              </p>

            )}


          {/* PRODUCT GRID */}

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product._id}
              >


                {/* PRODUCT NAME */}

                <h3>
                  {product.name}
                </h3>


                {/* PRODUCT PRICE */}

                <p className="price">
                  ₹{product.price}
                </p>


                {/* PRODUCT CATEGORY */}

                <p>

                  <strong>
                    Category:
                  </strong>{" "}

                  {product.category || "N/A"}

                </p>


                {/* PRODUCT DESCRIPTION */}

                <p>
                  {product.description ||
                    "No description"}
                </p>


                {/* ACTION BUTTONS */}

                <div className="product-actions">


                  {/* EDIT */}

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    Delete
                  </button>


                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;