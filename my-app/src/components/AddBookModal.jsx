import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddBookModal = ({ isOpen, closeModal }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [coverName, setCoverName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverBinary, setCoverBinary] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [bookData, setBookData] = useState({
    book_name: "",
    author_name: "",
    genre: "",
    total_pages: "",
    year_of_publication: new Date().getFullYear(),
    reading_status: "To Read",
    book_rating: 0,
    book_review: "",
    start_date: "",
    end_date: "",
    add_date: new Date().toISOString().split("T")[0], // Current Date
  });

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setIsWishlist(false);
    setRating(0);
    setHoverRating(0);
    setCoverName("");
    setCoverFile(null);
    setCoverBinary(null);
    setTags([]);
    setTagInput("");
    setYear(new Date().getFullYear());
    setBookData({
      book_name: "",
      author_name: "",
      genre: "",
      total_pages: "",
      year_of_publication: new Date().getFullYear(),
      reading_status: "To Read",
      book_rating: 0,
      book_review: "",
      start_date: "",
      end_date: "",
      add_date: new Date().toISOString().split("T")[0],
    });
    closeModal();
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverName(file.name);
      setCoverFile(file);

      // Convert image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 data
        setCoverBinary(base64String);
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddBook = async () => {
    const bookPayload = {
      ...bookData,
      reading_status: isWishlist ? "Wishlist" : bookData.reading_status,
      book_rating: rating,
      tags,
      cover_image: coverBinary,
      image_mimetype: coverFile ? coverFile.type : "",
    };

    try {
      const response = await fetch("http://localhost:8000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookPayload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Book added successfully!");
        handleCloseModal();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
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

        {/* Cover Upload */}
        <div className="cover-upload">
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
          {coverName && <p className="cover-name">Uploaded: {coverName}</p>}
        </div>

        {/* Form Fields */}
        <input type="text" name="book_name" placeholder="Title" className="input-field" onChange={handleInputChange} />
        <input type="text" name="author_name" placeholder="Author" className="input-field" onChange={handleInputChange} />
        <input type="text" name="genre" placeholder="Genre" className="input-field" onChange={handleInputChange} />

        <div className="flex-row">
          {/* Year Dropdown */}
          <select className="input-field small" name="year_of_publication" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <input type="number" name="total_pages" placeholder="Total Pages" className="input-field small" onChange={handleInputChange} />
        </div>

        {/* Wishlist or Library Toggle */}
        <div className="toggle-container">
          <button className={`toggle-button ${isWishlist ? "active" : ""}`} onClick={() => setIsWishlist(true)}>
            Wishlist
          </button>
          <button className={`toggle-button ${!isWishlist ? "active" : ""}`} onClick={() => setIsWishlist(false)}>
            Library
          </button>
        </div>

        {/* Status & Notes */}
        {!isWishlist && (
          <>
            <select className="input-field" name="reading_status" onChange={handleInputChange}>
              <option>To Read</option>
              <option>Reading</option>
              <option>Completed</option>
            </select>

            {/* Star Rating */}
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

            <textarea name="book_review" placeholder="Notes" className="input-field textarea" onChange={handleInputChange}></textarea>
          </>
        )}

        {/* Tags Input */}
        <div className="tag-input-container">
          <input type="text" placeholder="Add a tag" className="input-field tag-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
          <button className="add-tag-btn" onClick={handleAddTag}>Add</button>
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
cd
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
