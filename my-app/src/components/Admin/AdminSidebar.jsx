import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../side.css";
import { 
  MdDashboard, 
  MdPeople, 
  MdMenuBook, 
  MdAnalytics, 
  MdAdminPanelSettings, 
  MdSettings 
} from "react-icons/md";
import SidebarUserProfile from "../SidebarUserProfile";

const AdminSidebar = ({ userData, onLogout }) => {
  const navigate = useNavigate();

  const categories = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
    { name: "User Management", path: "/admin/users", icon: <MdPeople /> },
    { name: "Content Management", path: "/admin/content", icon: <MdMenuBook /> },
    { name: "Analytics", path: "/admin/analytics", icon: <MdAnalytics /> },
    { name: "Role Management", path: "/admin/roles", icon: <MdAdminPanelSettings /> },
    { name: "System Settings", path: "/admin/settings", icon: <MdSettings /> },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
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
      
      {/* User profile at bottom of sidebar */}
      <div className="sidebar-footer">
        <SidebarUserProfile userData={userData} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default AdminSidebar;
