const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Use dotenv for env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced Middleware
app.use(cors());
app.options("*", cors);
app.use(helmet()); // Security headers

// Rate Limiting (Protects against brute-force, DoS attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // Limit each IP to 200 requests per windowMs
});
app.use(limiter);

app.use(bodyParser.json());
app.use(morgan("tiny"));

// Import Routes
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL || '/api/v1'; // Default fallback

// API Routes
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.send("API is healthy"));

// Global Error Handler (Catches async errors as well)
app.use((err, req, res, next) => {
  console.error("Error: ", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecommerce-api",
  })
  .then(() => {
    console.log(`MongoDB connected`);
  })
  .catch((err) => {
    console.error("DB connection error: ", err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
