const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb =  require('./config/db')
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
connectDb();
app.use(cors());
app.use(express.json());


app.use("/api/transaction", transactionRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server running"));