import { AiOutlineClose } from "react-icons/ai";

const AddBookModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button className="close-button" onClick={closeModal}>
          <AiOutlineClose />
        </button>

        <h2 className="modal-title">Add New Book</h2>

        {/* Form Fields */}
        <input type="text" placeholder="Title" />
        <input type="text" placeholder="Author" />
        <input type="text" placeholder="Genre" />
        <div className="flex gap-2">
          <input type="number" placeholder="Year" />
          <input type="number" placeholder="Pages" />
        </div>

        {/* Status Dropdown */}
        <select>
          <option>To Read</option>
          <option>Reading</option>
          <option>Read</option>
        </select>

        <textarea placeholder="Notes"></textarea>

        {/* Tags Input */}
        <input type="text" placeholder="Tags (comma-separated)" />

        {/* Buttons */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="add-btn">Add Book</button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;