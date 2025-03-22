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
        const { readerid } = req.query; // Extract readerid from query params

        if (!readerid) {
            return res.status(400).json({ message: "Reader ID is required" });
        }

        const books = await Book.find({ readerid: Number(readerid) });
        res.json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books", error });
    }
});

// Get Single Book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findOne({ bookid: req.params.id }) || await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ book });
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Error fetching book details", error });
    }
});

// Route to add a new book with an image
router.post("/add", upload.single("cover_image"), async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.log("Received File:", req.file); // Check if file is correctly received
        const { book_name, author_name, genre, total_pages, year_of_publication, reading_status, book_rating, book_review, start_date, end_date, add_date, readerid,currently_read } = req.body;

        if (!readerid) {
            return res.status(400).json({ message: "Reader ID is required" });
        }

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
            cover_image: req.file ? req.file.path : "",
            readerid: Number(readerid),// Associate the book with the reader
            currently_read
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully!", book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add book", error });
    }
});

// Update Book Rating & Review
router.put("/:id", async (req, res) => {
    try {
        const { book_rating, book_review } = req.body;
        const updatedBook = await Book.findOneAndUpdate(
            { bookid: req.params.id },
            { book_rating, book_review },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully!", book: updatedBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Error updating book details", error });
    }
});

router.put("/:id/update-pages", async (req, res) => {
    try {
        console.log("Received request to update pages for book:", req.params.id);
        console.log("Request body:", req.body);

        const { pagesRead } = req.body;

        if (!pagesRead || pagesRead < 1) {
            return res.status(400).json({ message: "Invalid pages read count" });
        }

        // Find the book by bookid (ensure bookid is stored correctly)
        const book = await Book.findOne({ bookid: Number(req.params.id) });

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        console.log("Current book details before update:", book);

        // Ensure `currently_read` field exists in the database
        if (!book.currently_read) {
            book.currently_read = 0;
        }
        if(book.currently_read == 0 && pagesRead > 0){
            book.reading_status = "Reading";
            book.start_date = new Date().toISOString().split('T')[0];
        }
        // Update currently_read and ensure it doesn't exceed total_pages
        book.currently_read = Math.min(book.currently_read + pagesRead, book.total_pages);
        
        if (book.currently_read >= book.total_pages) {
            book.reading_status = "Completed";
            book.end_date = new Date().toISOString().split('T')[0];
            
        }

        console.log("Updated book details before saving:", book);

        await book.save();

        res.json({ message: "Reading progress updated!", book });
    } catch (error) {
        console.error("Error updating pages read:", error);
        res.status(500).json({ message: "Error updating reading progress", error });
    }
});


module.exports = router;