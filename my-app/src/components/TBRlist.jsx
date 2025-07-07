"use client"

import { useState, useEffect } from "react"
import { IoAdd, IoTrash, IoCheckmark } from "react-icons/io5"
import "../TBRList.css"

export default function TBRList({ readerId }) {
  const [tbrItems, setTbrItems] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const token = sessionStorage.getItem("token")

  const fetchTBRItems = async () => {
    try {
      const response = await fetch(`https://book-haven-or3q.onrender.com/tbr/${readerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const sortedItems = data.sort((a, b) => {
          if (a.isCompleted === b.isCompleted) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return a.isCompleted ? 1 : -1
        })
        setTbrItems(sortedItems)
      }
    } catch (error) {
      console.error("Error fetching TBR items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTBRItem = async () => {
    if (!newTitle.trim()) return

    setIsAdding(true)
    try {
      const response = await fetch("https://book-haven-or3q.onrender.com/tbr", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          author: newAuthor.trim() || undefined,
          readerid: readerId,
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setTbrItems((prev) => [newItem, ...prev])
        setNewTitle("")
        setNewAuthor("")
      }
    } catch (error) {
      console.error("Error adding TBR item:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const toggleCompletion = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`https://book-haven-or3q.onrender.com/tbr/${itemId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: !currentStatus,
        }),
      })

      if (response.ok) {
        setTbrItems((prev) => {
          const updated = prev.map((item) =>
            item._id === itemId ? { ...item, isCompleted: !currentStatus } : item
          )
          return updated.sort((a, b) => {
            if (a.isCompleted === b.isCompleted) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return a.isCompleted ? 1 : -1
          })
        })
      }
    } catch (error) {
      console.error("Error updating TBR item:", error)
    }
  }

  const deleteTBRItem = async (itemId) => {
    try {
      const response = await fetch(`https://book-haven-or3q.onrender.com/tbr/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTbrItems((prev) => prev.filter((item) => item._id !== itemId))
      }
    } catch (error) {
      console.error("Error deleting TBR item:", error)
    }
  }

  useEffect(() => {
    if (readerId) {
      fetchTBRItems()
    }
  }, [readerId])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTBRItem()
    }
  }

  const uncompletedCount = tbrItems.filter((item) => !item.isCompleted).length
  const completedCount = tbrItems.filter((item) => item.isCompleted).length

  if (isLoading) {
    return (
      <div className="tbr-container">
        <div>Loading your TBR list...</div>
      </div>
    )
  }

  return (
    <div className="tbr-container">
      <div className="tbr-card">
        <div className="tbr-header">
          <h2>My To Be Read List</h2>
          <div className="tbr-stats">
            {uncompletedCount} pending • {completedCount} completed
          </div>
        </div>

        <div className="tbr-form">
          <input
            type="text"
            placeholder="Book title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="tbr-input"
          />
          <input
            type="text"
            placeholder="Author (optional)"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            onKeyPress={handleKeyPress}
            className="tbr-input"
          />
          <button
            onClick={addTBRItem}
            disabled={!newTitle.trim() || isAdding}
            className="tbr-add-button"
            style={{
              backgroundColor: !newTitle.trim() || isAdding ? "#94a3b8" : "#3b82f6",
              cursor: !newTitle.trim() || isAdding ? "not-allowed" : "pointer",
            }}
          >
            <IoAdd size={20} />
          </button>
        </div>

        <div className="tbr-list">
          {tbrItems.length === 0 ? (
            <div className="tbr-empty">
              <div className="tbr-empty-title">Your TBR list is empty</div>
              <div className="tbr-empty-subtitle">Add your first book above to get started!</div>
            </div>
          ) : (
            tbrItems.map((item) => (
              <div
                key={item._id}
                className={`tbr-item ${item.isCompleted ? "completed" : ""}`}
              >
                <div
                  onClick={() => toggleCompletion(item._id, item.isCompleted)}
                  className={`tbr-checkbox ${item.isCompleted ? "completed" : ""}`}
                >
                  {item.isCompleted && <IoCheckmark color="white" size={14} />}
                </div>

                <div className="tbr-info">
                  <div className={`tbr-title ${item.isCompleted ? "completed" : ""}`}>
                    {item.title}
                  </div>
                  {item.author && (
                    <div className={`tbr-author ${item.isCompleted ? "completed" : ""}`}>
                      by {item.author}
                    </div>
                  )}
                </div>

                {item.isCompleted && (
                  <div className="tbr-check-icon">
                    <IoCheckmark size={16} />
                  </div>
                )}

                <button
                  onClick={() => deleteTBRItem(item._id)}
                  className="tbr-delete-button"
                >
                  <IoTrash size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
