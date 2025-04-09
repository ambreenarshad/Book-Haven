const express = require("express");
const cors = require("cors"); // Import CORS
const cron = require("node-cron");
const connectDB = require("./config/db");
const booksRoutes = require("./routes/books");
const readersRoutes = require("./routes/readers");
const tagRoutes = require("./routes/tags");
const readingGoalsRoutes = require("./routes/readingGoals");
const timerRoutes = require("./routes/timer");
const dashboardRoutes = require("./routes/dashboard")
const deleteOldTrash = require("./deleteOldTrash");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors()); // Enable CORS globally

// Connect to Database
connectDB();

// Routes
app.use("/book", booksRoutes);
app.use("/reader", readersRoutes);
app.use("/reading-goals", readingGoalsRoutes); 
app.use("/tags", tagRoutes);
app.use("/timer", timerRoutes);
app.use("/dashboard", dashboardRoutes);

// Run every day at 1 AM
cron.schedule("0 1 * * *", () => {
    console.log("Running daily trash cleanup...");
    deleteOldTrash();
  });
  
app.listen(8000, () => {
    console.log("Server started on port 8000");
});
