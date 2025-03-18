import React, { useState } from "react";

const Auth = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Default credentials
  const defaultEmail = "test@example.com";
  const defaultPassword = "password123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const form = new FormData(e.target);
      const email = form.get("email");
      const password = form.get("password");

      // Check credentials
      if (email === defaultEmail && password === defaultPassword) {
        setIsAuthenticated(true); // Redirect to main page
      } else {
        alert("Invalid email or password. Try again!");
      }

      setIsLoading(false);
    }, 1000);
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
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={defaultEmail} 
                className="input" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                defaultValue={defaultPassword} 
                className="input" 
                required 
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="John" className="input" required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" className="input" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="name@example.com" className="input" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="input" required />
            </div>
            <div className="form-group">
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
