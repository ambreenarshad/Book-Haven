import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/book/${id}`)
            .then((res) => res.json())
            .then((data) => setBook(data.book))
            .catch((error) => console.error("Error fetching book details:", error));
    }, [id]);

    if (!book) {
        return <p>Loading book details...</p>;
    }

    return (
        <div className="book-details">
            <button onClick={() => navigate(-1)}>← Back</button>
            <h1>{book.book_name}</h1>
            <div className="book-container">
                <img src={book.cover_image || "https://via.placeholder.com/150"} alt={book.book_name} className="book-cover-large" />
                <div className="mybook-info">
                    <p><strong>Author:</strong> {book.author_name}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Year of Publication:</strong> {book.year_of_publication}</p>
                    <p><strong>Pages:</strong> {book.total_pages}</p>
                    <p><strong>Reading Status:</strong> {book.reading_status}</p>
                    <p><strong>Rating:</strong> {book.book_rating} ⭐</p>
                    <p><strong>Review:</strong> {book.book_review || "No review available."}</p>
                    <p><strong>Started:</strong> {book.start_date}</p>
                    <p><strong>Completed:</strong> {book.end_date || "In progress"}</p>
                    <p><strong>Added on:</strong> {book.add_date}</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;