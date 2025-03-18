const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    book_name: String,
    author_name: String,
    genre: String,
    total_pages: Number,
    year_of_publication: Number,
    reading_status: String,
    book_rating: Number,
    book_review: String,
    start_date: String,
    end_date: String,
    add_date: String
} ,{ collection: "Book" });

module.exports = mongoose.model("Book", bookSchema);
