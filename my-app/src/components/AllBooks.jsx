import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, i) => (
                i < rating ? <FaStar key={i} color="gold" /> : <FaRegStar key={i} />
            ))}
        </div>
    );
};

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/book")
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.books);
                setFilteredBooks(data.books); // Initialize filtered books with all books
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, []);

    // Filter books based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(
                books.filter((book) =>
                    book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
                ||
                book.author_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, books]);

    return (
        <div className="all-books">
            <h1>All Books</h1>
            <p>Browse and manage your entire book collection.</p>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {/* Book List */}
            <div className="book-list">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => {
                        const progress = book.total_pages
                            ? ((book.current_page || 0) / book.total_pages) * 100
                            : 0;
                        const progressText = book.total_pages
                            ? `${book.current_page || 0} / ${book.total_pages} pages`
                            : "Not Started";

                        return (
                            <div
                                key={book.bookid || book._id}
                                className="book-card"
                                onClick={() => navigate(`/book/${book.bookid || book._id}`)}
                                style={{ cursor: "pointer" }} // Make clickable
                            >
                                <img
                                    src={book.cover_image || "https://via.placeholder.com/150"}
                                    alt={book.book_name}
                                    className="book-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/empty.png";
                                    }}
                                />
                                <div className="book-info">
                                    <h3>{book.book_name}</h3>
                                    <p>{book.author_name}, {book.year_of_publication}</p>
                                    <StarRating rating={book.book_rating || 0} />
                                    <div className={`status-badge ${book.reading_status}`}>
                                        {book.reading_status}
                                    </div>
                                    <p>Progress: {progressText}</p>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-books">No books available.</p>
                )}
            </div>
        </div>
    );
};

export default AllBooks;
