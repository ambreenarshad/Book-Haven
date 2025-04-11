import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const SidebarUserProfile = ({ userData, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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

  // Use reader ID from session storage as fallback if userData isn't available
  const readerId = sessionStorage.getItem("reader_id") || "Unknown";
  
  return (
    <div className="sidebar-user-profile" ref={dropdownRef}>
      <div 
        className="user-profile-button" 
        onClick={toggleDropdown}
      >
        <FaUserCircle className="user-icon" />
        <div className="user-info">
          <span className="user-name">
            {userData ? `${userData.first_name} ${userData.last_name}` : "User"}
          </span>
          <span className="user-email">
            {/* {userData ? userData.email : `ID: ${readerId}`} */}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-info">
            <h3>Account</h3>
            {/* {userData ? (
              <>
                <p className="full-name">{userData.first_name} {userData.last_name}</p>
                <p className="email">{userData.email}</p>
              </>
            ) : (
              <p className="reader-id">Reader ID: {readerId}</p>
            )} */}
{userData ? (
  <>
    <p className="full-name">{userData.first_name} {userData.last_name}</p>
    <p className="email">{userData.email}</p>
    <p className="reader-id">Reader ID: {userData.reader_id || readerId}</p>
  </>
) : (
  <>

    <p className="reader-id">Reader ID: {readerId}</p>
  </>
)}
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