const express = require("express");

const Reader = require("../models/Reader");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const router = express.Router();
// Get All Readers
router.get("/", async (req, res) => {
    try {
        // Check if the requested ID matches the token's user ID
        if (req.params.id !== req.user.id) {
          return res.status(403).json({ message: "Access denied: You can only access your own profile." });
        }
    
        const reader = await Reader.findById(req.params.id);
        if (!reader) {
          return res.status(404).json({ message: "Reader not found" });
        }
    
        res.json({ reader: readerData });
      } catch (error) {
        console.error("Error fetching reader:", error);
        res.status(500).json({ message: "Error fetching reader details", error });
      }
});
router.get("/:id", async (req, res) => {
    try {
            const reader = await Reader.findOne({ reader_id: req.params.id }) || await Reader.findById(req.params.id);
            if (!reader) {
                return res.status(404).json({ message: "Reader not found" });
            }
    
            res.json({ reader });
        } catch (error) {
            console.error("Error fetching reader:", error);
            res.status(500).json({ message: "Error fetching reader details", error });
        }
});

// **Login Route**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const reader = await Reader.findOne({ email });
      if (!reader) {
        return res.status(400).json({ message: "Invalid email or password." });
      }
  
      const isMatch = await bcrypt.compare(password, reader.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }
  
      // Create JWT token
      const token = jwt.sign({ id: reader._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.json({ message: "Login successful", token, reader_id: reader.reader_id });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// **Register Route**
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, date_of_birth } = req.body;

    try {
        const existingReader = await Reader.findOne({ email });
        if (existingReader) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const newReader = new Reader({ first_name, last_name, email, password, date_of_birth });
        await newReader.save();

        res.json({ message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;