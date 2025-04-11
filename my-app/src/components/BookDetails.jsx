import { useEffect, useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "./Tabs";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import "../BookDetails.css";
import ReadingTimerDialog from "./ReadingTimerDialog"; // Import the modal

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isTimerOpen, setIsTimerOpen] = useState(false); // Modal state
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/book/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBook(data.book);
                setTags(data.tags || []);
                setRating(data.book.book_rating || 0);
                setReview(data.book.book_review || "");
            })
            .catch((error) => console.error("Error fetching book details:", error));
    }, [id]);

    const updateReview = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:8000/book/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_rating: rating, book_review: review }),
            });

            if (response.ok) {
                const updatedBook = await response.json();
                setBook(updatedBook.book);
            } else {
                console.error("Failed to update book review");
            }
        } catch (error) {
            console.error("Error updating review:", error);
        }
        setIsUpdating(false);
    };

    if (!book) {
        return <p>Loading book details...</p>;
    }

    return (
        <div className="book-details">
        <button onClick={() => navigate(-1)} className="bookDetails-back-button">← Back</button>   
        <h1 className="BookDetails-h1">{book.book_name}</h1>
        <div className="book-container">        
            <div className="book-image-container">
                <img
                    src={book.cover_image || "https://via.placeholder.com/150"}
                    alt={book.book_name}
                    className="book-cover-large"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/empty.jpeg";
                    }}
                />
                {/* Log Reading Session Button */}
                <button onClick={() => setIsTimerOpen(true)} className="log-reading-button">
                            ⏱ Log Reading Session
                        </button>
                        {/* Timer Dialog */}
                        {isTimerOpen && (
                            <ReadingTimerDialog 
                            onClose={() => setIsTimerOpen(false)} 
                            bookId={book.bookid}  // ✅ Ensure `book.bookid` is passed correctly
                            
                        />
                        
                        )}

            </div>
            <div className="Book-Segment">
                <Tabs defaultValue="details">
                    <TabsList className="pretty-tabs">
                        <TabsTrigger value="details" className="pretty-tab">Details</TabsTrigger>
                        <TabsTrigger value="reread" className="pretty-tab">Reread History</TabsTrigger>
                        <TabsTrigger value="quotes" className="pretty-tab">Quotes</TabsTrigger>
                        <TabsTrigger value="ai" className="pretty-tab">AI Summary</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                        <div className="mybook-info">
                        <p><strong>Author:</strong> {book.author_name}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                        <p><strong>Year of Publication:</strong> {book.year_of_publication}</p>
                        <p><strong>Pages:</strong> {book.total_pages}</p>
                        <p><strong>Pages Read:</strong> {book.currently_read} / {book.total_pages}</p>

                        {/* Rating */}
                        <p className="rating-container">
                            <strong>Rating:</strong>
                            {[...Array(5)].map((_, index) => {
                                const starIndex = index + 1;
                                return (
                                    <span 
                                        key={starIndex} 
                                        onClick={() => setRating(starIndex)} 
                                        className={`star ${starIndex <= rating ? "filled" : "empty"}`}
                                    >
                                        {starIndex <= rating ? <FaStar /> : <FaRegStar />}
                                    </span>
                                );
                            })}
                        </p>

                        {/* Review */}
                        <p><strong>Review:</strong></p>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="review-textarea"
                            rows="2"
                        ></textarea>
                        <button 
                            onClick={updateReview} 
                            className="save-review-button"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <p><strong>Started:</strong> {book.start_date}</p>
                        <p><strong>Completed:</strong> {book.end_date }</p>
                        <p><strong>Added on:</strong> {book.add_date}</p>
                        {/* Render Tags */}
                        {tags.length > 0 && (
                            <div className="tag-container">
                                {tags.map((tagObj, index) => (
                                    <span key={index} className="tag-pill">
                                        {tagObj.tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>            
    </div>
    </div>
    );
};

export default BookDetails;