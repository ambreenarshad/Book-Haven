// deleteOldTrash.js
const Trash = require("./models/Trash");
const Book = require("./models/Book");

async function deleteOldTrash() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldEntries = await Trash.find({ deletedAt: { $lt: thirtyDaysAgo } });

    for (const entry of oldEntries) {
        await Book.deleteOne({ bookid: entry.bookId });
        await Trash.deleteOne({ trashId: entry.trashId });
    }
}

deleteOldTrash().then(() => console.log("Old trash cleaned up"));
