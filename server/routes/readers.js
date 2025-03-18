const express = require("express");
const Reader = require("../models/Reader");

const router = express.Router();
// Get All Readers
router.get("/", async (req, res) => {
    try {
        const readers = await Reader.find(); 
        res.json({ readers });
    } catch (error) {
        console.error("Error fetching readers:", error);
        res.status(500).json({ message: "Error fetching readers", error });
    }
});

// **Login Route**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const reader = await Reader.findOne({ email, password }); 
        if (!reader) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        res.json({ message: "Login successful" });
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
