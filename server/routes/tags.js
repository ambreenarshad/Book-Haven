const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags"); // Import the Tag model

// ✅ Create a new tag
router.post("/", async (req, res) => {
    try {
        const { bookid, tag } = req.body;

        if (!bookid || !tag) {
            return res.status(400).json({ error: "Book ID and Tag are required." });
        }

        const newTag = new Tag({ bookid, tag });
        await newTag.save();
        res.status(201).json({ message: "Tag added successfully!", tag: newTag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all tags
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a single tag by ID
router.get("/:id", async (req, res) => {
    try {
        const tag = await Tag.findOne({ id: req.params.id });

        if (!tag) {
            return res.status(404).json({ error: "Tag not found!" });
        }

        res.json(tag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update a tag by ID
router.put("/:id", async (req, res) => {
    try {
        const { tag } = req.body;

        const updatedTag = await Tag.findOneAndUpdate(
            { id: req.params.id },
            { tag },
            { new: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ error: "Tag not found!" });
        }

        res.json({ message: "Tag updated successfully!", tag: updatedTag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a tag by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedTag = await Tag.findOneAndDelete({ id: req.params.id });

        if (!deletedTag) {
            return res.status(404).json({ error: "Tag not found!" });
        }

        res.json({ message: "Tag deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
