import axios from "axios";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddBookModal = ({ isOpen, closeModal }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [coverName, setCoverName] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  
  if (!isOpen) return null;

  const handleCloseModal = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setTotalPages("");
    setYear(new Date().getFullYear());
    setStatus("");
    setIsWishlist(false);
    setRating(0);
    setHoverRating(0);
    setCoverName("");
    setTags([]);
    setTagInput("");
    setNotes("");
    setErrors({});
    closeModal();
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverName(file.name);
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleAddBook = async () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!author.trim()) newErrors.author = "Author is required.";
    if (!genre.trim()) newErrors.genre = "Genre is required.";
    if (!totalPages.trim()) newErrors.totalPages = "Total Pages is required.";
    if (!year) newErrors.year = "Year of publication is required.";
    if (!isWishlist && !status) newErrors.status = "Status is required.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const formData = new FormData();
    formData.append("book_name", title);
    formData.append("author_name", author);
    formData.append("genre", genre);
    formData.append("total_pages", totalPages);
    formData.append("year_of_publication", year);
    formData.append("reading_status", isWishlist ? "Wishlist" : status);
    formData.append("book_rating", rating);
    formData.append("book_review", notes);
    formData.append("start_date", ""); // Optional, add later
    formData.append("end_date", "");   // Optional, add later
    formData.append("add_date", new Date().toISOString());
  
    if (coverFile) {
      formData.append("cover_image", coverFile); // Attach file
    }
  
    try {
      const response = await axios.post("http://localhost:8000/book/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Book Added:", response.data);
      alert("Book added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  // Generate years from 1900 to the current year
  const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={handleCloseModal}>
          <AiOutlineClose />
        </button>

        <h2 className="modal-title">Add New Book</h2>

        {/* Cover Upload (Optional) */}
        <div className="cover-upload">
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
          {coverName && <p className="cover-name">Uploaded: {coverName}</p>}
        </div>

        {/* Form Fields (Required) */}
        <input
          type="text"
          placeholder={errors.title ? errors.title : "Title"}
          className={`input-field ${errors.title ? "input-error" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder={errors.author ? errors.author : "Author"}
          className={`input-field ${errors.author ? "input-error" : ""}`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder={errors.genre ? errors.genre : "Genre"}
          className={`input-field ${errors.genre ? "input-error" : ""}`}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <div className="flex-row">
          {/* Year Dropdown (Required) */}
          <select
            className={`input-field small ${errors.year ? "input-error" : ""}`}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="" disabled>
              {errors.year ? errors.year : "Select Year"}
            </option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder={errors.totalPages ? errors.totalPages : "Total Pages"}
            className={`input-field small ${errors.totalPages ? "input-error" : ""}`}
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value)}
          />
        </div>


        {/* Wishlist or Library Toggle */}
        <div className="toggle-container">
          <button
            className={`toggle-button ${isWishlist ? "active" : ""}`}
            onClick={() => setIsWishlist(true)}
          >
            Wishlist
          </button>
          <button
            className={`toggle-button ${!isWishlist ? "active" : ""}`}
            onClick={() => setIsWishlist(false)}
          >
            Library
          </button>
        </div>

        {/* Status (Required if not Wishlist) */}
        {!isWishlist && (
          <>
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option>To Read</option>
              <option>Reading</option>
              <option>Completed</option>
            </select>
            {errors.status && <p className="error-text">{errors.status}</p>}

            {/* Star Rating (Optional) */}
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Notes (Optional) */}
            <textarea
              placeholder="Notes"
              className="input-field textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </>
        )}

        {/* Tags Input (Optional) */}
        <div className="tag-input-container">
          <input
            type="text"
            placeholder="Add a tag"
            className="input-field tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button className="add-tag-btn" onClick={handleAddTag}>
            Add
          </button>
        </div>

        {/* Display Added Tags */}
        <div className="tags-display">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button className="remove-tag-btn" onClick={() => removeTag(index)}>✖</button>
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="add-btn" onClick={handleAddBook}>
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
