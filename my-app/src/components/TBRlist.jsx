"use client"

import { useState, useEffect } from "react"
import { IoAdd, IoTrash, IoCheckmark } from "react-icons/io5"

export default function TBRList({ readerId }) {
  const [tbrItems, setTbrItems] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const token = sessionStorage.getItem("token")

  // Fetch TBR items
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
        // Sort items: uncompleted first, then completed (muted) at bottom
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

  // Add new TBR item
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

  // Toggle completion status
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
          const updated = prev.map((item) => (item._id === itemId ? { ...item, isCompleted: !currentStatus } : item))
          // Re-sort after status change
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

  // Delete TBR item
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <div style={{ fontSize: "18px" }}>Loading your TBR list...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          backgroundColor: "var(--card-bg, #ffffff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
            paddingBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>My To Be Read List</h2>
          <div style={{ fontSize: "14px", color: "var(--text-muted, #64748b)" }}>
            {uncompletedCount} pending • {completedCount} completed
          </div>
        </div>

        {/* Add new item form */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Book title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <input
            type="text"
            placeholder="Author (optional)"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: "200px",
              padding: "12px",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={addTBRItem}
            disabled={!newTitle.trim() || isAdding}
            style={{
              padding: "12px 16px",
              backgroundColor: !newTitle.trim() || isAdding ? "#94a3b8" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: !newTitle.trim() || isAdding ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IoAdd size={20} />
          </button>
        </div>

        {/* TBR Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tbrItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "var(--text-muted, #64748b)",
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>Your TBR list is empty</div>
              <div style={{ fontSize: "14px" }}>Add your first book above to get started!</div>
            </div>
          ) : (
            tbrItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color, #e2e8f0)",
                  backgroundColor: item.isCompleted ? "var(--muted-bg, #f8fafc)" : "transparent",
                  opacity: item.isCompleted ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggleCompletion(item._id, item.isCompleted)}
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid var(--border-color, #e2e8f0)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: item.isCompleted ? "#22c55e" : "transparent",
                    borderColor: item.isCompleted ? "#22c55e" : "var(--border-color, #e2e8f0)",
                  }}
                >
                  {item.isCompleted && <IoCheckmark color="white" size={14} />}
                </div>

                {/* Book Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: "500",
                      textDecoration: item.isCompleted ? "line-through" : "none",
                      color: item.isCompleted ? "var(--text-muted, #64748b)" : "inherit",
                    }}
                  >
                    {item.title}
                  </div>
                  {item.author && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted, #64748b)",
                        textDecoration: item.isCompleted ? "line-through" : "none",
                      }}
                    >
                      by {item.author}
                    </div>
                  )}
                </div>

                {/* Completed indicator */}
                {item.isCompleted && (
                  <div style={{ color: "#22c55e" }}>
                    <IoCheckmark size={16} />
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => deleteTBRItem(item._id)}
                  style={{
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#fef2f2")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
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
