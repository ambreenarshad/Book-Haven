import { useState} from "react";
// import "./Recommendations.css"; // Optional for styling

const genres = ["Fantasy", "Science", "Romance", "History", "Horror"];

const Recommendations= () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async (genre) => {
    setLoading(true);
    try {
      const apiKey = 'AIzaSyDC-ghoqFWOso7cMD0pl7_ea9rt5tRzMx0'; // Replace with your actual API key
      const query = `subject:${encodeURIComponent(genre)}`;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const books = data.items.map(item => ({
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown Author'],
      }));
      setRecommendations(books);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    fetchRecommendations(genre);
  };

  return (
    <div className="recommendations-container">
      <h2>📚 Get Recommendations by Genre</h2>
      <div className="genre-selector">
        {genres.map((genre) => (
          <button
            key={genre}
            className={genre === selectedGenre ? "active-genre" : ""}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading recommendations...</p>
      ) : (
        <div className="recommendation-results">
          {recommendations.length === 0 && selectedGenre && (
            <p>No recommendations found for "{selectedGenre}"</p>
          )}
          <ul>
            {recommendations.map((book, index) => (
              <li key={index}>
                <strong>{book.title}</strong> {book.authors && `by ${book.authors.join(", ")}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default Recommendations;