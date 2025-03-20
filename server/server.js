const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");
const booksRoutes = require("./routes/books");
const readersRoutes = require("./routes/readers");
const bodyParser = require("body-parser");

const app = express();

// Increase request size limit (default is 100kb, so we set it higher)
app.use(express.json({ limit: "10mb" })); // JSON request limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Form data limit
app.use(bodyParser.json({ limit: "10mb" })); // BodyParser limit (for extra safety)

// Enable CORS for frontend connection
app.use(cors()); 

// Connect to Database
connectDB();

// Routes
app.use("/book", booksRoutes);
app.use("/reader", readersRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
