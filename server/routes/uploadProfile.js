const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Reader = require("../models/Reader");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-profile", upload.single("image"), async (req, res) => {
    const { readerId } = req.body;

    if (!req.file || !readerId) {
        return res.status(400).json({ error: "Image and readerId are required" });
    }

    try {
        // Upload image to Cloudinary using a promise wrapper
        const uploadedImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "BookHaven/ProfilePics" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // Save the image URL to the reader's profile in DB
        await Reader.updateOne(
            { reader_id: readerId },
            { $set: { profilePicUrl: uploadedImage.secure_url } }
        );

        // Return the URL to the frontend
        res.json({
            message: "Upload successful",
            profilePicUrl: uploadedImage.secure_url,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});
router.post("/remove-profile", async (req, res) => {
    const { readerId } = req.body;
  
    if (!readerId) {
      return res.status(400).json({ error: "readerId is required" });
    }
  
    try {
      await Reader.updateOne({ reader_id: readerId }, { $set: { profilePicUrl: "" } });
      res.json({ message: "Profile picture removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to remove profile picture" });
    }
  });
  
// Route to update reader's details
router.post("/update-reader-info", async (req, res) => {
    const { readerId, first_name, last_name, email } = req.body;

    if (!readerId || !first_name || !last_name || !email) {
        return res.status(400).json({ error: "All fields (first_name, last_name, email, readerId) are required" });
    }

    try {
        const updatedReader = await Reader.updateOne(
            { reader_id: readerId },
            { $set: { first_name, last_name, email } }
        );

        if (updatedReader.nModified === 0) {
            return res.status(400).json({ error: "No changes made or reader not found" });
        }

        res.json({
            message: "Reader info updated successfully",
            reader: { first_name, last_name, email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
});
// Route to update the reader's password (without bcrypt hashing)
router.post("/update-password", async (req, res) => {
    const { readerId, password } = req.body;

    if (!readerId || !password) {
        return res.status(400).json({ error: "Reader ID and password are required" });
    }

    try {
        const updatedReader = await Reader.updateOne(
            { reader_id: readerId },
            { $set: { password: password } }  // Save the plain password (not hashed)
        );

        if (updatedReader.nModified === 0) {
            return res.status(400).json({ error: "No changes made or reader not found" });
        }

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
});

module.exports = router;
