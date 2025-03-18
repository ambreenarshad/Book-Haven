const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

//Get All Books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        // console.log("Fetched books from DB:", books); // Debugging log
        res.json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books", error });
    }
});

module.exports = router;
