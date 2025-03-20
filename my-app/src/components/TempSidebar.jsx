import { Link } from "react-router-dom";

const Sidebar = () => {
  const categories = [
    { name: "Dashboard", path: "/" },
    { name: "All Books", path: "/all-books" },
    { name: "Currently Reading", path: "/currently-reading" },
    { name: "Completed", path: "/completed" },
    { name: "To Read", path: "/to-read" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Lent Out", path: "/lent-out" },
    { name: "Borrowed", path: "/borrowed" }
  ];

  return (
    <div className="sidebar">
      <h2>Book Collection</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <Link to={category.path}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;