import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import '../side.css'; // Ensure your CSS file is correctly imported

const TempSidebar = () => {
  console.log("Sidebar component rendered!");

  const categories = [
    "Dashboard", "All Books", "Currently Reading", "Completed", "To Read", "Wishlist", "Lent Out", "Borrowed"
  ];

  return (
    <div className="sidebar">
      <h2>Book Collection</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <Link to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}>
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current page path

  return (
    <div className="page">
      <h1>{title}</h1>
      {/* Show back button only if not on the main page */}
      {location.pathname !== "/" && (
        <button className="back-button" onClick={() => navigate(-1)}>
          {"< Back"}
        </button>
      )}
    </div>
  );
};

const App = () => {
  const categories = [
    "Dashboard", "All Books", "Currently Reading", "Completed", "To Read", "Wishlist", "Lent Out", "Borrowed"
  ];

  return (
    <Router>
      <div className="app-container">
        <TempSidebar />
        <div className="content">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<PlaceholderPage title="Dashboard" />} />
            
            {/* Dynamic Routes for Categories */}
            {categories.map((category, index) => (
              <Route
                key={index}
                path={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                element={<PlaceholderPage title={category} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
