const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

// GET /dashboard/summary/:readerid
router.get("/summary/:readerid", async (req, res) => {
    try {
      const readerId = Number(req.params.readerid); // ensure it's a number
  
      const totalBooks = await Book.countDocuments({ readerid: readerId });
      const completedBooks = await Book.countDocuments({ readerid: readerId, reading_status: "Completed" });
      const currentlyReading = await Book.countDocuments({ readerid: readerId, reading_status: "Reading" });
  
      res.json({ totalBooks, completedBooks, currentlyReading });
    } catch (err) {
      console.error("Error in /dashboard/summary/:readerid:", err);
      res.status(500).json({ error: "Server error while fetching summary" });
    }
  });
// // GET /dashboard/weekly-stats
// router.get("/weekly-stats", async (req, res) => {
//     const today = new Date();
//     const weekAgo = new Date(today);
//     weekAgo.setDate(today.getDate() - 6);

//     const weeklyStats = await Timer.aggregate([
//         {
//             $match: {
//                 date: { $gte: weekAgo }
//             }
//         },
//         {
//             $group: {
//                 _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//                 totalPages: { $sum: "$pages_read" },
//                 totalTime: { $sum: "$real_time" }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ]);

//     res.json(weeklyStats);
// });
// // GET /currently-reading
// router.get("/currently-reading", async (req, res) => {
//     const books = await Book.find({ reading_status: "Reading" }, {
//         book_name: 1,
//         total_pages: 1,
//         currently_read: 1,
//         cover_image: 1
//     });

//     res.json(books);
// });


module.exports = router;
