const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
connectDB();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);

const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
