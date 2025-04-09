const express = require("express");
const Timer = require("../models/Timer");
const router = express.Router();

router.post("/log", async (req, res) => {
    console.log("Received Timer Data:", req.body);  // Log incoming data

    const { bookId, duration, real_time, pages_read } = req.body;

    if (!bookId || !duration || !real_time || !pages_read) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const newSession = new Timer({
            bookId,
            duration: Number(duration),
            real_time: Number(real_time),
            pages_read: Number(pages_read),
            date: new Date()  // Optionally override if needed
        });

        await newSession.save();
        res.status(201).json({ message: "Timer session logged successfully!", session: newSession });
    } catch (err) {
        console.error("Error saving timer session:", err);
        res.status(500).json({ message: "Failed to save timer session.", error: err.message });
    }
});

module.exports = router;
