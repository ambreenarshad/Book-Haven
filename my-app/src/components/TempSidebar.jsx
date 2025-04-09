import "../side.css"; 
import { Link } from "react-router-dom";
// Import icons from react-icons
import { FaTrash } from "react-icons/fa";
import { 
  MdDashboard, 
  MdMenuBook, 
  MdAutoStories, 
  MdCheckCircle, 
  MdBookmark, 
  MdShare, 
  MdDownload, 
  MdCategory
} from "react-icons/md";

const Sidebar = () => {
  const categories = [
    { name: "Dashboard", path: "/", icon: <MdDashboard /> },
    { name: "All Books", path: "/all-books", icon: <MdMenuBook /> },
    { name: "Currently Reading", path: "/currently-reading", icon: <MdAutoStories /> },
    { name: "Completed", path: "/completed", icon: <MdCheckCircle /> },
    { name: "Wishlist", path: "/wishlist", icon: <MdBookmark /> },
    { name: "Lent Out", path: "/lent-out", icon: <MdShare /> },
    { name: "Borrowed", path: "/borrowed", icon: <MdDownload /> },
    { name: "Genre", path: "/genre", icon: <MdCategory /> },
    { name: "Trash", path: "/trash", icon: <FaTrash /> },

  ];

  return (
    <div className="sidebar">
      <h2>Book Collection</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <Link to={category.path}>
              <span className="icon">{category.icon}</span>
              <span className="label">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;