const express = require("express");
const router = express.Router();
const Reader = require("../models/Reader");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(auth, isAdmin);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await Reader.find({}, { password: 0 });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await Reader.findOne({ reader_id: req.params.id }, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { first_name, last_name, email, isAdmin } = req.body;
    const user = await Reader.findOne({ reader_id: req.params.id });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await Reader.findOne({ reader_id: req.params.id });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get book by ID
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create book
router.post("/books", async (req, res) => {
  try {
    const { title, author, isbn, description, cover_image_url } = req.body;
    const newBook = new Book({ title, author, isbn, description, cover_image_url });
    await newBook.save();
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update book
router.put("/books/:id", async (req, res) => {
  try {
    const { title, author, isbn, description, cover_image_url } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (description) book.description = description;
    if (cover_image_url) book.cover_image_url = cover_image_url;

    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete book
router.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.remove();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await Reader.countDocuments();
    const totalBooks = await Book.countDocuments();
    const activeUsers = await Reader.countDocuments({ last_login: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });

    res.json({
      totalUsers,
      totalBooks,
      activeUsers,
      recentActivity: [] // TODO: Implement recent activity tracking
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 