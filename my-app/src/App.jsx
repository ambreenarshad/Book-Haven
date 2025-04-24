"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
//import "./app.css";

import Header from "./components/Header"
import AddBookModal from "./components/AddBookModal"
import Auth from "./components/Auth"
import Sidebar from "./components/TempSidebar"
import PlaceholderPage from "./components/PlaceholderPage"
import AllBooks from "./components/AllBooks"
import BookDetails from "./components/BookDetails"
import Dashboard from "./components/DashBoard"
import Genre from "./components/Genre"
import Trash from "./components/Trash"
import Favorites from "./components/Favorites"
import BookAnimation from "./components/BookAnimation"
import Recommendations from "./components/Recommendations"
import LentOut from "./components/LentOut"
import Borrowed from "./components/Borrowed"
import AccountPage from "./components/AccountPage";
const App = () => {
  const [theme, setTheme] = useState("light")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentReaderId, setCurrentReaderId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [mainContentVisible, setMainContentVisible] = useState(false)
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const handleLogin = (readerId) => {
    console.log("Logging in with Reader ID:", readerId) // Debugging
    setCurrentReaderId(readerId)
    sessionStorage.setItem("reader_id", readerId) // Store in sessionStorage
    // Show animation first
    setShowAnimation(true)
    fetchUserData(readerId)
  }

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setIsAuthenticated(true)
    setShowMainContent(true)

    // Add a small delay before fading in the main content
    setTimeout(() => {
      setMainContentVisible(true)
    }, 100)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentReaderId(null)
    setUserData(null)
    setShowMainContent(false)
    setMainContentVisible(false)
    sessionStorage.removeItem("reader_id")
    navigate("/");
  }

  const fetchUserData = async (readerId) => {
    try {
      const response = await fetch(`http://localhost:8000/reader/${readerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        console.error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light"
    setTheme(storedTheme)
    document.documentElement.classList.toggle("dark", storedTheme === "dark")

    const storedReaderId = sessionStorage.getItem("reader_id")
    console.log("Retrieved Reader ID from sessionStorage:", storedReaderId) // Debugging
    if (storedReaderId) {
      setIsAuthenticated(true)
      setShowMainContent(true)
      setMainContentVisible(true)
      setCurrentReaderId(storedReaderId)
      fetchUserData(storedReaderId)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
        {showAnimation && <BookAnimation onAnimationComplete={handleAnimationComplete} />}
  
        {!isAuthenticated && !showAnimation ? (
          <div className="app">
            <SiteHeader toggleTheme={toggleTheme} theme={theme} />
            <main className="main flex flex-col justify-center p-4">
              <div className="w-full flex flex-col">
                <div className="w-full max-w-md text-left mb-8">
                  <h1 className="Welcome-h1">Welcome</h1>
                  <p className="AccountSignIn">Sign in to your account to continue</p>
                </div>
                <div className="w-full max-w-md">
                  <Auth setIsAuthenticated={setIsAuthenticated} onLogin={handleLogin} />
                </div>
              </div>
            </main>
          </div>
        ) : (
          showMainContent && (
            <div
              className={`app-container flex transition-opacity duration-1000 ease-in-out ${mainContentVisible ? "opacity-100" : "opacity-0"}`}
            >
              <Sidebar userData={userData} onLogout={handleLogout} />
              <div className="content flex-grow">
                <Header
                  toggleTheme={toggleTheme}
                  theme={theme}
                  openModal={openModal}
                  userData={userData}
                  onLogout={handleLogout}
                />
                <AddBookModal isOpen={isModalOpen} closeModal={closeModal} readerId={currentReaderId} />
  
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/all-books" element={<AllBooks />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/currently-reading" element={<AllBooks statusFilter="Reading" />} />
                  <Route path="/completed" element={<AllBooks statusFilter="Completed" />} />
                  <Route path="/wishlist" element={<AllBooks statusFilter="To Read" />} />
                  <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" />} />
                  <Route path="/lent-out" element={<LentOut />} />
                  <Route path="/borrowed" element={<Borrowed />} />
                  <Route path="/genre" element={<Genre />} />
                  <Route path="/trash" element={<Trash />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/account" element={<AccountPage userData={userData} onLogout={handleLogout} />} />
                  <Route path="/login" element={<Auth />} />
                </Routes>
              </div>
            </div>
          )
        )}
      </div>
  
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )  
}

const SiteHeader = ({ toggleTheme, theme }) => (
  <header className="gheader">
    <div className="container">
      <a href="/" className="logo">
        BookHaven
      </a>
      <div className="theme-toggle-container">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀"}
        </button>
      </div>
    </div>
  </header>
)

export default App