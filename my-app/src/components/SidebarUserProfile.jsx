import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../side.css"

const SidebarUserProfile = ({ userData, onLogout, onMobileMenuClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  console.log("user data in sidebar: ", userData);
  console.log("user first name: ", userData?.reader?.first_name);
  console.log("user last name: ", userData?.reader?.last_name);
  console.log("user email: ", userData?.reader?.email);
  console.log("userimage:", userData?.reader?.profilePicUrl);

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
    if (onMobileMenuClose) onMobileMenuClose(); // Close mobile menu
    onLogout();
  };

  const goToAccount = () => {
    setIsOpen(false);
    if (onMobileMenuClose) onMobileMenuClose(); // Close mobile menu
    navigate("/account");
  };

  // Render a fallback UI if userData is not available yet
  if (!userData?.reader) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar-user-profile" ref={dropdownRef}>
      <div 
        className="user-profile-button" 
        onClick={toggleDropdown}
      >
        {userData?.reader?.profilePicUrl ? (
          <img 
            src={userData.reader.profilePicUrl} 
            alt="Profile" 
            className="user-icon profile-pic"
          />
        ) : (
          <FaUserCircle className="user-icon" />
        )}
        <div className="user-info">
          <span className="user-name">
            {userData?.reader?.first_name ? `${userData.reader.first_name} ${userData.reader.last_name}` : "User"}
          </span>
          <span className="user-email">
            {userData?.reader?.email || "No email available"}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-info account-item" onClick={goToAccount}>
            <span className="account-text">Account</span>
            <FiSettings className="settings-icon" />
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