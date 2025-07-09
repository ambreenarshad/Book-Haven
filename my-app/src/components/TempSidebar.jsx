
import React, { useState } from "react";
import "../side.css";
import { Link } from "react-router-dom";
// Import icons from react-icons
import { FaTrash, FaHeart, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { TiThumbsOk } from "react-icons/ti";
import {
  MdDashboard,
  MdMenuBook,
  MdAutoStories,
  MdCheckCircle,
  MdBookmark,
  MdShare,
  MdDownload,
  MdCategory,
  MdLibraryBooks
} from "react-icons/md";
import SidebarUserProfile from "./SidebarUserProfile";

const Sidebar = ({ userData, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  console.log("user data in tempsidebar: ", userData);
  
  const categories = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
    { name: "All Books", path: "/all-books", icon: <MdMenuBook /> },
    { name: "Recommendations", path: "/recommendations", icon: <TiThumbsOk /> },
    { name: "Currently Reading", path: "/currently-reading", icon: <MdAutoStories /> },
    { name: "Completed", path: "/completed", icon: <MdCheckCircle /> },
    { name: "Wishlist", path: "/wishlist", icon: <MdBookmark /> },
    { name: "TBR", path: "/tbr", icon: <FaClipboardList /> },
    { name: "Favorites", path: "/favorites", icon: <FaHeart /> },
    { name: "Lent Out", path: "/lent-out", icon: <MdShare /> },
    { name: "Borrowed", path: "/borrowed", icon: <MdDownload /> },
    { name: "Genre", path: "/genre", icon: <MdCategory /> },
    { name: "Trash", path: "/trash", icon: <FaTrash /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button 
        className="mobile-menu-button" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <Link to={category.path} onClick={closeMobileMenu}>
                <span className="icon">{category.icon}</span>
                <span className="label">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User profile at bottom of sidebar */}
        <div className="sidebar-footer">
          <SidebarUserProfile userData={userData} onLogout={onLogout} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;