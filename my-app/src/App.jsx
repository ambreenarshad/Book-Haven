

 

 // Import the CSS file


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AddBookModal from "./components/AddBookModal";
import Auth from "./components/Auth";
import Sidebar from "./components/TempSidebar";
import PlaceholderPage from "./components/PlaceholderPage";
import AllBooks from "./components/AllBooks";
import BookDetails from "./components/BookDetails";
import Dashboard from "./components/DashBoard";
import Genre from "./components/Genre";


const App = () => {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReaderId, setCurrentReaderId] = useState(null);
  const handleLogin = (readerId) => {
    console.log("Logging in with Reader ID:", readerId); // Debugging
    setIsAuthenticated(true);
    setCurrentReaderId(readerId);
    sessionStorage.setItem("reader_id", readerId); // Store in localStorage
  };
  
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    const storedReaderId = sessionStorage.getItem("reader_id");
    console.log("Retrieved Reader ID from localStorage:", storedReaderId); // Debugging
    if (storedReaderId) {
      setIsAuthenticated(true);
      setCurrentReaderId(storedReaderId);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
        {!isAuthenticated ? (
          <div className="app">
            <SiteHeader toggleTheme={toggleTheme} theme={theme} />
            <main className="main flex flex-col justify-center p-4">
              <div className="w-full flex flex-col">
                <div className="w-full max-w-md text-left mb-8">
                  <h1 className="Welcome-h1">
                    Welcome
                  </h1>
                  <p className="AccountSignIn">
                    Sign in to your account to continue
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <Auth setIsAuthenticated={setIsAuthenticated} onLogin={handleLogin} />
                </div>
              </div>
            </main>
          </div>
        ) : (
          <div className="app-container flex">
            <Sidebar />
            <div className="content flex-grow">
              <Header toggleTheme={toggleTheme} theme={theme} openModal={openModal} />
              <AddBookModal isOpen={isModalOpen} closeModal={closeModal}  readerId={currentReaderId} />

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/all-books" element={<AllBooks />} /> {/* ✅ AllBooks should be here */}
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/currently-reading" element={<AllBooks statusFilter="Reading" />} />
                <Route path="/completed" element={<AllBooks statusFilter="Completed" />} />
                <Route path="/wishlist" element={<AllBooks statusFilter="To Read"/>} />
                <Route path="/lent-out" element={<PlaceholderPage title="Lent Out" />} />
                <Route path="/borrowed" element={<PlaceholderPage title="Borrowed" />} />
                <Route path="/genre" element={<Genre />} /> {/* Add the new Genre route */}
                
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

const SiteHeader = ({ toggleTheme, theme }) => (
  <header className="gheader">
    <div className="container">
      <a href="/" className="logo">BookHaven</a>
      <div className="theme-toggle-container">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀"}
        </button>
      </div>
    </div>
</header>
);
export default App;
