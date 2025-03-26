require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const env = require("dotenv");
import { PrismaClient } from "@prisma/client";
import testRouter from "./routs/placesRouter";

env.config();
const app = express();
const PORT = 3001;

// Database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "competition",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(cors());
app.use(express.json());

// Check database connection
try {
  const prisma = new PrismaClient();
  console.log("Prisma client created successfully");
} catch (error) {
  console.log("Prisma client creation failed");
  console.error(error);
}

// Welcome Route
app.get("/", (req, res) => {
  res.send(
    "🚀 Welcome to the Competition WEB <dev> Challenge 2025 Node.js template!"
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use("/api/v1/places", testRouter);
