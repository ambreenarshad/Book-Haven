import "./global.css";
import "./main.css";
import "./side.css"; 
import "./allbooks.css"; 
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AddBookModal from "./components/AddBookModal";
import Auth from "./components/Auth";
import Sidebar from "./components/TempSidebar";
import PlaceholderPage from "./components/PlaceholderPage";
import AllBooks from "./components/AllBooks";
import BookDetails from "./components/BookDetails";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
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
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    Welcome
                  </h1>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Sign in to your account to continue
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <Auth setIsAuthenticated={setIsAuthenticated} />
                </div>
              </div>
            </main>
          </div>
        ) : (
          <div className="app-container flex">
            <Sidebar />
            <div className="content flex-grow">
              <Header toggleTheme={toggleTheme} theme={theme} openModal={openModal} />
              <AddBookModal isOpen={isModalOpen} closeModal={closeModal} />

              <Routes>
                <Route path="/" element={<PlaceholderPage title="Dashboard" />} /> {/* ✅ Dashboard should be here */}
                <Route path="/all-books" element={<AllBooks />} /> {/* ✅ AllBooks should be here */}
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/currently-reading" element={<PlaceholderPage title="Currently Reading" />} />
                <Route path="/completed" element={<PlaceholderPage title="Completed" />} />
                <Route path="/to-read" element={<PlaceholderPage title="To Read" />} />
                <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" />} />
                <Route path="/lent-out" element={<PlaceholderPage title="Lent Out" />} />
                <Route path="/borrowed" element={<PlaceholderPage title="Borrowed" />} />
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
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙" : "☀"}
      </button>
    </div>
  </header>
);

export default App;