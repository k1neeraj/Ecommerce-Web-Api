const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const PORT = 3000;
const cors = require("cors");

require("dotenv/config");

app.use(cors());
app.options("*", cors); // it is some type of http request

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Routes
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecommerce-api",
  })
  .then(() => {
    console.log(`MongoDb Is Connected`);
  })
  .catch((err) => {
    console.log(err);
  });

// Server Connection
app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
