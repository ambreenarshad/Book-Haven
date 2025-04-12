const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 8000;

app.get('/:genre', async (req, res) => {
  const genre = req.params.genre;
  const apiKey = 'YOUR_GOOGLE_BOOKS_API_KEY'; // Replace with your actual API key
  const query = `subject:${encodeURIComponent(genre)}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const books = data.items.map(item => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown Author'],
    }));
    res.json({ books });
  } catch (error) {
    console.error('Error fetching data from Google Books API:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
