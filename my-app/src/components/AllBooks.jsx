import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../allbooks.css"; 
const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, i) => (
                i < rating ? <FaStar key={i} color="gold" /> : <FaRegStar key={i} />
            ))}
        </div>
    );
};

const AllBooks = ({ statusFilter }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const readerId = sessionStorage.getItem("reader_id"); // Get reader_id from localStorage
    
                if (!readerId) {
                    console.error("No reader ID found.");
                    return;
                }
    
                const response = await axios.get(`http://localhost:8000/book?readerid=${readerId}`);
                let fetchedBooks = response.data.books;
    
                if (statusFilter) {
                    fetchedBooks = fetchedBooks.filter(book => book.reading_status === statusFilter);
                }
    
                setBooks(fetchedBooks);
                setFilteredBooks(fetchedBooks);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching books:", error);
                setLoading(false);
            }
        };
    
        fetchBooks();
    }, [statusFilter]);
    

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(
                books.filter((book) =>
                    book.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, books]);

    const renderBookList = () => {
        if (loading) {
            return <p>Loading books...</p>;
        }
        
        if (filteredBooks.length === 0) {
            return <p>No books found for {statusFilter || "all books"}.</p>;
        }

        return (
            <div className="book-list">
                {filteredBooks.map((book) => {
                    const progress = book.total_pages
                        ? ((book.currently_read || 0) / book.total_pages) * 100
                        : 0;
                    const progressText = book.total_pages
                        ? `${book.currently_read || 0} / ${book.total_pages} pages`
                        : "Not Started";

                    return (
                        <div
                            key={book.bookid || book._id}
                            className="book-card"
                            onClick={() => navigate(`/book/${book.bookid || book._id}`)}
                            style={{ cursor: "pointer" }}
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
                })}
            </div>
        );
    };

    return (
        <div className="all-books">
            <h1>{statusFilter ? `${statusFilter} Books` : "All Books"}</h1>
            <p>Browse and manage your entire book collection.</p>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {/* Book List or Status Messages */}
            {renderBookList()}
        </div>
    );
};

export default AllBooks;