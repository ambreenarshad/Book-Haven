const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");
const booksRoutes = require("./routes/books");
const readersRoutes = require("./routes/readers")

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors());
// Connect to Database
connectDB();

// Routes
app.use("/book", booksRoutes);
app.use("/reader",readersRoutes);
app.listen(8000, () => {
    console.log("Server started on port 8000");
});