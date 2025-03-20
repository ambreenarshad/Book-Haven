const express = require("express");
const multer = require("multer");
const Book = require("../models/Book");

const router = express.Router();

// Multer Storage Setup (Store file in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add New Book Route
router.post("/", upload.single("cover_image"), async (req, res) => {
    try {
        const { book_name, author_name, genre, total_pages, year_of_publication, reading_status, book_rating, book_review, start_date, end_date, add_date } = req.body;
        let coverImageBinary = null;
        let imageMimetype = null;

        if (req.file) {
            coverImageBinary = req.file.buffer;  // Convert image to binary buffer
            imageMimetype = req.file.mimetype;  // Store image mimetype
        }
        // Create New Book Entry
        const newBook = new Book({
            book_name,
            author_name,
            genre,
            total_pages: parseInt(total_pages),
            year_of_publication: parseInt(year_of_publication),
            reading_status,
            book_rating: parseFloat(book_rating),
            book_review,
            start_date,
            end_date,
            add_date,
            cover_image:  coverImageBinary,  // Store image as binary data
            image_mimetype: imageMimetype,
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Error adding book", error });
    }
});

// Get All Books Route
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books", error });
    }
});

module.exports = router;
