const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "book_covers", // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });

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

// Route to add a new book with an image
router.post("/add", upload.single("cover_image"), async (req, res) => {
    try {
        const { book_name, author_name, genre, total_pages, year_of_publication, reading_status, book_rating, book_review, start_date, end_date, add_date } = req.body;

        const newBook = new Book({
            book_name,
            author_name,
            genre,
            total_pages,
            year_of_publication,
            reading_status,
            book_rating,
            book_review,
            start_date,
            end_date,
            add_date,
            cover_image: req.file ? req.file.path : "", // Store Cloudinary URL
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully!", book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add book", error });
    }
});


module.exports = router;