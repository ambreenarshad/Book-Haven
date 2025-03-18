import "./global.css";
import "./main.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AddBookModal from "./components/AddBookModal";
import Auth from "./components/Auth"; // Import Auth.jsx

const App = () => {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Theme from Local Storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  // Toggle Dark Mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Open/Close Add Book Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      {!isAuthenticated ? (
        <div className="app">
          <SiteHeader toggleTheme={toggleTheme} theme={theme} />
          <main className="main flex flex-col justify-center p-4">
            <div className="w-full flex flex-col">
              <div className="w-full max-w-md text-left mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white move-welcome">
                  Welcome
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 move-signin">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Use Auth Component */}
              <div className="w-full max-w-md">
                <Auth setIsAuthenticated={setIsAuthenticated} />
              </div>
            </div>
          </main>
        </div>
      ) : (
        <>
          <Header toggleTheme={toggleTheme} theme={theme} openModal={openModal} />
          <AddBookModal isOpen={isModalOpen} closeModal={closeModal} />
          <MainContent />
        </>
      )}
    </div>
  );
};

const MainContent = () => (
  <div className="p-6 text-center">
    <h2 className="text-2xl font-semibold">Welcome to My Bookshelf</h2>
    <p className="text-gray-600">This is a simple bookshelf application where you can manage your books.</p>
    <div className="mt-6 p-6 bg-gray-100 rounded-lg">
      <p className="text-gray-500">Your books will appear here</p>
    </div>
  </div>
);

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