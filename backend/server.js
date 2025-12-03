const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "shopuser",
  password: process.env.DB_PASSWORD || "shoppassword",
  database: process.env.DB_NAME || "sneaker_shop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, email, firstName, lastName },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, email, first_name, last_name, address, city, postal_code FROM users WHERE id = ?",
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = users[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      address: user.address,
      city: user.city,
      postalCode: user.postal_code,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ PRODUCTS ROUTES ============

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single product with sizes
app.get("/api/products/:id", async (req, res) => {
  try {
    const [products] = await pool.query(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [sizes] = await pool.query(
      "SELECT size, stock FROM product_sizes WHERE product_id = ? ORDER BY CAST(size AS UNSIGNED)",
      [req.params.id]
    );

    res.json({ ...products[0], sizes });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ CATEGORIES ROUTES ============

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ ORDERS ROUTES ============

// Create order
app.post("/api/orders", authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { items, shippingAddress, shippingCity, shippingPostalCode } =
      req.body;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const [products] = await connection.query(
        "SELECT price FROM products WHERE id = ?",
        [item.productId]
      );
      if (products.length > 0) {
        totalAmount += products[0].price * item.quantity;
      }
    }

    // Create order
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, shipping_city, shipping_postal_code) VALUES (?, ?, ?, ?, ?)",
      [
        req.user.id,
        totalAmount,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
      ]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const [products] = await connection.query(
        "SELECT price FROM products WHERE id = ?",
        [item.productId]
      );
      if (products.length > 0) {
        await connection.query(
          "INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)",
          [orderId, item.productId, item.size, item.quantity, products[0].price]
        );

        // Update stock
        await connection.query(
          "UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size = ?",
          [item.quantity, item.productId, item.size]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      totalAmount,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    connection.release();
  }
});

// Get user orders
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    // Get items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        `
        SELECT oi.*, p.name, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
