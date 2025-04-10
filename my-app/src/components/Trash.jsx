import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
import "../trash.css";
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

const Trash = () => {
  const [trashedBooks, setTrashedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    const fetchTrash = async () => {
      const readerId = sessionStorage.getItem("reader_id");
      console.log("Reader ID from session:", readerId);
      try {
        const res = await axios.get(`http://localhost:8000/book/trash?readerid=${readerId}`);
        setTrashedBooks(res.data);
      } catch (err) {
        console.error("Error fetching trashed books:", err);
      }
    };
    fetchTrash();
  }, []);
  
  const handleBulkRestore = async () => {
    if (selectedBooks.length === 0) {
      alert("Please select books to restore.");
      return;
    }
  
    const confirmRestore = window.confirm("Are you sure you want to restore the selected books?");
    if (!confirmRestore) return;
  
    try {
      await axios.post("http://localhost:8000/book/trash/restore", { bookIds: selectedBooks });
      setTrashedBooks((prev) => prev.filter((book) => !selectedBooks.includes(book.bookId)));
      setSelectedBooks([]); // ✅ clear selection
    } catch (err) {
      console.error("Bulk restore failed:", err);
      alert("Restore failed. Check the console.");
    }
  };  

  const handlePermanentDelete = async () => {
    if (selectedBooks.length === 0) {
      alert("Please select books to permanently delete.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to permanently delete the selected books?");
    if (!confirmDelete) return;

    try {
      await axios.post("http://localhost:8000/book/trash/delete", { bookIds: selectedBooks });
      setTrashedBooks((prev) => prev.filter((book) => !selectedBooks.includes(book.bookId)));
      setSelectedBooks([]); // Reset selected books
    } catch (err) {
      console.error("Permanent delete failed:", err);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelected) =>
      prevSelected.includes(bookId)
        ? prevSelected.filter((id) => id !== bookId) // Deselect if already selected
        : [...prevSelected, bookId] // Select if not selected
    );
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === trashedBooks.length) {
      setSelectedBooks([]); // Deselect all if all are selected
    } else {
      setSelectedBooks(trashedBooks.map((book) => book.bookId)); // Select all books
    }
  };

  const getDaysInTrash = (deletedAt) => {
    const deletedDate = new Date(deletedAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - deletedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };  

  return (
    <div className="all-books">
      <h1>Trashed Books</h1>
      <p>These books are currently in trash. You can restore or permanently delete them.</p>

      <div className="bulk-actions">
        <div className="select-all-container">
            <input
            id="select-all"
            type="checkbox"
            checked={
                trashedBooks.length > 0 && selectedBooks.length === trashedBooks.length
            }
            onChange={handleSelectAll}
            />
            <label htmlFor="select-all">Select All</label>
        </div>

        <button onClick={handlePermanentDelete}>Permanently Delete Selected</button>
        <button onClick={handleBulkRestore}>Restore Selected</button>
        </div>

      <div className="book-list">
        {trashedBooks.length === 0 ? (
          <p>No trashed books found.</p>
        ) : (
          trashedBooks.map((book) => {
            const progress = book.total_pages
              ? ((book.currently_read || 0) / book.total_pages) * 100
              : 0;
            const progressText = book.total_pages
              ? `${book.currently_read || 0} / ${book.total_pages} pages`
              : "To Read";

            return (
              <div key={book.bookId} className="book-card" style={{ cursor: "default" }}>
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book.bookId)}
                  onChange={() => handleSelectBook(book.bookId)}
                />
                <img
                  src={book.cover_image || "https://via.placeholder.com/150"}
                  alt={book.book_name}
                  className="book-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/empty.jpeg";
                  }}
                />
                <div className="book-info">
                  <h3>{book.book_name}</h3>
                  <p>{book.author_name}, {book.year_of_publication}</p>
                  <StarRating rating={book.book_rating || 0} />
                  <div className={`status-badge ${book.prevReadingStatus}`}>
                    {book.prevReadingStatus}
                  </div>

                  <p>Progress: {progressText}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="trashed-duration">{getDaysInTrash(book.deletedAt)}</p>
                </div>
                {/* <button
                  onClick={() => handleRestore(book.bookId)}
                  className="restore-btn"
                >
                  ♻️ Restore
                </button> */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Trash;
