import { useEffect, useState } from "react";
import "../DashBoard.css";
import { 
  MdDashboard, 
  MdMenuBook, 
  MdAutoStories, 
  MdCheckCircle,
  MdFlag,
  MdTimeline
} from "react-icons/md";
import { LuLibrary,LuNotebookText } from "react-icons/lu";
import { AiOutlinePieChart } from "react-icons/ai";
import { Line } from "react-chartjs-2"; // Importing the Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [goals, setGoals] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit modal
  const [updatedGoals, setUpdatedGoals] = useState({}); // Store updated values
  const [summary, setSummary] = useState(null);
  const [pagesChartData, setPagesChartData] = useState(null);
  const [minutesChartData, setMinutesChartData] = useState(null);
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const readerId = sessionStorage.getItem("reader_id");
  const currentTheme = sessionStorage.getItem('theme') || 'light'; // Default to 'light' if not set
  const darkMode = currentTheme === 'dark'; // Boolean value indicating dark mode
  useEffect(() => {
    if (!readerId) {
      console.error("Reader ID is missing from sessionStorage.");
      return;
    }

    fetch(`http://localhost:8000/reading-goals/${readerId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Goals:", data);
        setGoals(data);
        setUpdatedGoals(data); // Set initial values for editing
      })
      .catch((err) => console.error("Error fetching goals:", err));

    fetch(`http://localhost:8000/dashboard/summary/${readerId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Summary:", data);
        setSummary(data);
      })
      .catch((err) => console.error("Error fetching summary:", err));

    fetch(`http://localhost:8000/dashboard/currently-reading/${readerId}`)
      .then(res => res.json())
      .then(data => {
        setCurrentlyReadingBooks(data);
      })
      .catch(err => console.error("Error fetching currently reading books:", err));
      
    fetch(`http://localhost:8000/dashboard/genre-counts/${readerId}`)
    .then((res) => res.json())
    .then((data) => {
      const formattedData = data.map((item) => ({
        name: item._id || "Unknown",
        value: item.count,
      }));
      setGenreData(formattedData);
    })
    .catch((err) => console.error("Error fetching genre data:", err));
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/dashboard/timer/${readerId}`);
          const data = await response.json();
      
          if (response.ok) {
            const labels = data.map(item => item.date);
            const totalPages = data.map(item => item.totalPages);
            const totalMinutes = data.map(item => item.totalMinutes);
      
            setPagesChartData({
              labels: labels,
              datasets: [
                {
                  label: 'Total Pages Read',
                  data: totalPages,
                  borderColor:'rgb(81, 78, 87)',
                  fill: false,
                  tension: 0.1,
                },
              ],
            });
      
            setMinutesChartData({
              labels: labels,
              datasets: [
                {
                  label: 'Total Minutes Read',
                  data: totalMinutes,
                  // borderColor: 'rgba(153, 102, 255, 1)',
                  borderColor:'rgb(81, 78, 87)',
                  // borderColor: 'rgb(75, 73, 79)',
                  fill: false,
                  tension: 0.1,
                },
              ],
            });
          } else {
            console.error("Failed to fetch data:", data.message || 'Unknown error');
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData()
 
  }, [readerId]); // Runs when readerId changes

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUpdatedGoals({ ...updatedGoals, [e.target.name]: Number(e.target.value) });
  };

  const handleSave = () => {
    const url = `http://localhost:8000/reading-goals/${readerId}`;
  
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reader_id: readerId,
        yearly_goal: updatedGoals.yearly_goal || 0,
        yearly_progress: updatedGoals.yearly_progress || 0,
        monthly_goal: updatedGoals.monthly_goal || 0,
        monthly_progress: updatedGoals.monthly_progress || 0,
        weekly_goal: updatedGoals.weekly_goal || 0,
        weekly_progress: updatedGoals.weekly_progress || 0
      }),
    })
      .then((res) => {
        if (res.status === 404) {
          // If no goals found, create new ones
          return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reader_id: readerId,
              yearly_goal: updatedGoals.yearly_goal || 0,
              yearly_progress: updatedGoals.yearly_progress || 0,
              monthly_goal: updatedGoals.monthly_goal || 0,
              monthly_progress: updatedGoals.monthly_progress || 0,
              weekly_goal: updatedGoals.weekly_goal || 0,
              weekly_progress: updatedGoals.weekly_progress || 0
            }),
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Updated or Created Goals:", data);
        setGoals(data); // Update UI state
        setIsEditing(false); // Close modal
      })
      .catch((err) => console.error("Error updating or creating goals:", err));
  };  

  if (!goals) {
    return <div>Loading...</div>;
  }
  if (!summary) {
    return <div>Loading summary...</div>;
  }
  if (!pagesChartData || !minutesChartData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Left-aligned heading */}
      <h1 className="dashboard-heading">Dashboard</h1>
    
      <div className="book-summary">
        <h2 className="summary-heading">
          <LuLibrary style={{ fontSize: '1.6rem', marginBottom: '-2px' }}/> Reading Statistics </h2>
        <div className="summary-cards">
          <div className="summary-card">
            <p className="summary-title">
              <MdMenuBook style={{ marginBottom: '-2px' }}/> Total Books</p>
            <p className="summary-value">{summary.totalBooks}</p>
          </div>
          <div className="summary-card">
            <p className="summary-title">
              <MdCheckCircle style={{ marginBottom: '-2px' }}/> Completed</p>
            <p className="summary-value">{summary.completedBooks}</p>
          </div>
          <div className="summary-card">
            <p className="summary-title">
              <MdAutoStories style={{ marginBottom: '-2px' }}/> Currently Reading</p>
            <p className="summary-value">{summary.currentlyReading}</p>
          </div>
        </div>
        <div className="charts-container">
          <div className="chart-container">
            <h3>Total Pages Read per Day</h3>
            <Line data={pagesChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Pages Read per Day' } } }} />
          </div>

          <div className="chart-container">
            <h3>Total Minutes of Reading per Day</h3>
            <Line data={minutesChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Minutes of Reading per Day' } } }} />
          </div>
        </div>
        <div className="dashboard-row">
  {/* Genre Pie Chart */}
  <div className="genre-chart-container">
  <h2 className="chart-heading"><AiOutlinePieChart style={{ marginBottom: '-2px' }}/> Genre Distribution</h2>
  {genreData.length === 0 ? (
    <p>Loading genre data...</p>
  ) : (
    <ResponsiveContainer width="100%" height={270}>
    <PieChart>
      <Pie
        data={genreData}
        dataKey="value"
        nameKey="name"
        outerRadius={90}
        className="genre-pie-chart"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Display genre name and percentage
      >
        {genreData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            className="genre-pie-chart-cell"
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
  )}
</div>

  {/* Currently Reading Container */}
  <div className="currently-reading-container">
    <h2 className="currently-reading-heading"><LuNotebookText style={{ marginBottom: '-2px' }} /> Currently Reading</h2>
    {currentlyReadingBooks.map((book) => {
      const progress = Math.min(Math.round((book.currently_read / book.total_pages) * 100), 100);
      return (
        <div key={book.bookid} className="currently-reading-item">
          <p className="book-title">{book.book_name} by {book.author_name}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{progress}%</span>
        </div>
      );
    })}
  </div>
</div>


      </div> 

      <div className="ReadingGoals">
        <h2 className="ReadingGoals-h2">
          <MdFlag style={{ fontSize: '1.6rem', marginBottom: '-2px' }}/>Reading Goals</h2>
        <p className="ReadingGoals-p">Track your reading progress based on completed books</p>

        <GoalProgress title="Yearly Goal" current={goals.yearly_progress} total={goals.yearly_goal} />
        <GoalProgress title="Monthly Goal" current={goals.monthly_progress} total={goals.monthly_goal} />
        <GoalProgress title="Weekly Goal" current={goals.weekly_progress} total={goals.weekly_goal} />

        {/* Edit Goals Button */}
        <button className="edit-button" onClick={handleEditClick}>Edit Goals</button>

        {/* Modal for Editing Goals */}
        {isEditing && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Your Goals</h3>
              <label>Yearly Goal: <input type="number" name="yearly_goal" value={updatedGoals.yearly_goal} onChange={handleChange} /></label>
              <label>Monthly Goal: <input type="number" name="monthly_goal" value={updatedGoals.monthly_goal} onChange={handleChange} /></label>
              <label>Weekly Goal: <input type="number" name="weekly_goal" value={updatedGoals.weekly_goal} onChange={handleChange} /></label>
              
              <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleClose}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GoalProgress = ({ title, current, total }) => {
  const displayCurrent = current > total ? total : current; // Cap the displayed progress
  const progress = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0; // Ensure max 100%

  return (
    <div className="goal">
      <p>
        {title} ({displayCurrent} of {total})
      </p>
      <div className="ReadingGoals-progress-bar">
        <div className="ReadingGoals-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <span>{progress}%</span>
    </div>
  );
};

export default Dashboard;
