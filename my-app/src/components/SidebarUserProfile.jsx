import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const SidebarUserProfile = ({ userData, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Log the structure of userData to verify it's available
  console.log("user data in sidebar: ", userData);

  // Check the properties of userData for debugging
  console.log("user first name: ", userData?.reader?.first_name); // Access first_name under 'reader'
  console.log("user last name: ", userData?.reader?.last_name); // Access last_name under 'reader'
  console.log("user email: ", userData?.reader?.email); // Access email under 'reader'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  // Render a fallback UI if userData is not available yet
  if (!userData?.reader) {
    return <div>Loading...</div>;  // You can show a loading spinner or any other fallback
  }

  return (
    <div className="sidebar-user-profile" ref={dropdownRef}>
      <div 
        className="user-profile-button" 
        onClick={toggleDropdown}
      >
        <FaUserCircle className="user-icon" />
        <div className="user-info">
          <span className="user-name">
            {/* Using optional chaining to safely access first_name and last_name under 'reader' */}
            {userData?.reader?.first_name ? `${userData.reader.first_name} ${userData.reader.last_name}` : "User"}
          </span>
          <span className="user-email">
            {/* Optional chaining for email */}
            {userData?.reader?.email || "No email available"}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-info">
            <h3>Account</h3>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <IoLogOutOutline />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
