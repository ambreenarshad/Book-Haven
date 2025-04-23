import "../global.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Auth = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const form = new FormData(e.target);
    const email = form.get("email").trim();
    const password = form.get("password").trim();
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
  
    // Password length check
    if (password.length < 4) {
      alert("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
  
    // Additional fields for registration
    let userData = { email, password };
    if (activeTab === "register") {
      const first_name = form.get("firstName").trim();
      const last_name = form.get("lastName").trim();
      const date_of_birth = form.get("dateOfBirth");
  
      const nameRegex = /^[A-Za-z\s]+$/; // allows only alphabets and spaces

      if (!first_name || !last_name) {
        alert("First and last names are required.");
        setIsLoading(false);
        return;
      }
      
      if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
        alert("Names must only contain letters and spaces. Numbers are not allowed.");
        setIsLoading(false);
        return;
      }
  
      const birthDate = new Date(date_of_birth);
      if (isNaN(birthDate) || birthDate >= new Date()) {
        alert("Please enter a valid date of birth in the past.");
        setIsLoading(false);
        return;
      }
  
      userData = { email, password, first_name, last_name, date_of_birth };
    }
  
    // Fetch API call
    const endpoint = activeTab === "login" ? "/reader/login" : "/reader/register";
  
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (activeTab === "login") {
          sessionStorage.setItem("reader_id", data.reader_id);
          sessionStorage.setItem("token", data.token);
          if (onLogin) onLogin(data.reader_id);
          navigate("/");
        } else {
          alert(data.message);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {activeTab === "login" ? (
          <>
            <div className="form-group-auth">
              <label>Email</label>
              <input type="email" name="email" className="input" required />
            </div>
            <div className="form-group-auth">
              <label>Password</label>
              <input type="password" name="password" className="input" required />
            </div>
          </>
        ) : (
          <>
            <div className="form-group-auth">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="John" className="input" required />
            </div>
            <div className="form-group-auth">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" className="input" required />
            </div>
            <div className="form-group-auth">
              <label>Email</label>
              <input type="email" name="email" placeholder="name@example.com" className="input" required />
            </div>
            <div className="form-group-auth">
              <label>Password</label>
              <input type="password" name="password" className="input" required />
            </div>
            <div className="form-group-auth">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" className="input" required />
            </div>
          </>
        )}

        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? "Loading..." : activeTab === "login" ? "Sign In →" : "Sign Up →"}
        </button>
      </form>
    </div>
  );
};

export default Auth;