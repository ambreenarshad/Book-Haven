const express = require("express")
const router = express.Router()
const TBR = require("../models/TBR")

// Simple auth check function that works with your existing setup
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided" })
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  // Since you're using sessions, you might want to check the session instead
  // For now, just continue - you can integrate with your existing auth later
  next()
}

// Get all TBR items for a reader
router.get("/:readerId", checkAuth, async (req, res) => {
  try {
    const { readerId } = req.params
    console.log(`Fetching TBR items for reader: ${readerId}`)

    const tbrItems = await TBR.find({ readerid: Number.parseInt(readerId) }).sort({ isCompleted: 1, createdAt: -1 })

    console.log(`Found ${tbrItems.length} TBR items`)
    res.json(tbrItems)
  } catch (error) {
    console.error("Error fetching TBR items:", error)
    res.status(500).json({ error: "Failed to fetch TBR items" })
  }
})

// Add new TBR item
router.post("/", checkAuth, async (req, res) => {
  try {
    const { title, author, readerid } = req.body
    console.log("Adding TBR item:", { title, author, readerid })

    if (!title || !readerid) {
      return res.status(400).json({ error: "Title and reader ID are required" })
    }

    const newTBRItem = new TBR({
      title: title.trim(),
      author: author?.trim() || "",
      readerid: Number.parseInt(readerid),
      isCompleted: false,
      createdAt: new Date(),
    })

    const savedItem = await newTBRItem.save()
    console.log("TBR item saved:", savedItem)
    res.status(201).json(savedItem)
  } catch (error) {
    console.error("Error adding TBR item:", error)
    res.status(500).json({ error: "Failed to add TBR item", details: error.message })
  }
})

// Update TBR item (toggle completion, edit title/author)
router.patch("/:itemId", checkAuth, async (req, res) => {
  try {
    const { itemId } = req.params
    const updates = req.body
    console.log(`Updating TBR item ${itemId}:`, updates)

    // If marking as completed, set completedAt timestamp
    if (updates.isCompleted === true) {
      updates.completedAt = new Date()
    } else if (updates.isCompleted === false) {
      updates.completedAt = null
    }

    const updatedItem = await TBR.findByIdAndUpdate(itemId, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedItem) {
      return res.status(404).json({ error: "TBR item not found" })
    }

    console.log("TBR item updated:", updatedItem)
    res.json(updatedItem)
  } catch (error) {
    console.error("Error updating TBR item:", error)
    res.status(500).json({ error: "Failed to update TBR item", details: error.message })
  }
})

// Delete TBR item
router.delete("/:itemId", checkAuth, async (req, res) => {
  try {
    const { itemId } = req.params
    console.log(`Deleting TBR item: ${itemId}`)

    const deletedItem = await TBR.findByIdAndDelete(itemId)

    if (!deletedItem) {
      return res.status(404).json({ error: "TBR item not found" })
    }

    console.log("TBR item deleted:", deletedItem)
    res.json({ message: "TBR item deleted successfully" })
  } catch (error) {
    console.error("Error deleting TBR item:", error)
    res.status(500).json({ error: "Failed to delete TBR item", details: error.message })
  }
})

// Get TBR statistics for a reader
router.get("/:readerId/stats", checkAuth, async (req, res) => {
  try {
    const { readerId } = req.params

    const stats = await TBR.aggregate([
      { $match: { readerid: Number.parseInt(readerId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$isCompleted", 1, 0] } },
          pending: { $sum: { $cond: ["$isCompleted", 0, 1] } },
        },
      },
    ])

    const result = stats[0] || { total: 0, completed: 0, pending: 0 }
    res.json(result)
  } catch (error) {
    console.error("Error fetching TBR stats:", error)
    res.status(500).json({ error: "Failed to fetch TBR statistics" })
  }
})

module.exports = router
