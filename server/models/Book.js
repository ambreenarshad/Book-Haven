const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
    add_date: String,
    bookid: Number
} ,{ collection: "Book" });

bookSchema.plugin(AutoIncrement, { inc_field: "bookid" });
module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);

