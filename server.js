const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

 app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HireLyn API is running",
  });
});
 
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes); 
app.use("/api/applications", applicationRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to HireLyn API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`HireLyn server running on http://localhost:${PORT}`);
});