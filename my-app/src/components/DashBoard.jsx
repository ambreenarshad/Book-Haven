import { useEffect, useState } from "react";
import "../DashBoard.css";

const Dashboard = () => {
  const [goals, setGoals] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit modal
  const [updatedGoals, setUpdatedGoals] = useState({}); // Store updated values
  const readerId = sessionStorage.getItem("reader_id");

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
  }, [readerId]);

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

  return (
  <div className="dashboard-container">
    {/* Left-aligned heading */}
    <h1 className="dashboard-heading">Dashboard</h1>
    <div className="ReadingGoals">
      <h2 className="ReadingGoals-h2">📖 Reading Goals</h2>
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
