const express = require("express");
const connectDB = require("./config/db");
const booksRoutes = require("./routes/books");

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Connect to Database
connectDB();

// Routes
app.use("/routes", booksRoutes);

app.listen(8000, () => {
    console.log("Server started on port 8000");
});