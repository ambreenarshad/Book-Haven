const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/", async (req, res) => {
  const { bookName, authorName } = req.body;

  if (!bookName || !authorName) {
    return res.status(400).json({ error: "Missing bookName or authorName" });
  }

  const prompt = `Summarize the book titled "${bookName}" by ${authorName}. Focus on the plot, main characters, and themes.`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API Key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // Updated model to use
        prompt: prompt,
        max_tokens: 500, // Adjust tokens to fit your summary length
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return res.status(500).json({ error: "Failed to generate summary" });
    }

    res.json({ summary: data.choices[0].text.trim() });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
