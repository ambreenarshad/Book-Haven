const mongoose = require("mongoose")

const tbrSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    readerid: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { collection: "TBR" },
)

// Index for efficient querying by reader
tbrSchema.index({ readerid: 1, createdAt: -1 })

module.exports = mongoose.model("TBR", tbrSchema)
