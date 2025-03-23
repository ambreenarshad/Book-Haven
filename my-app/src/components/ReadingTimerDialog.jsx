// import { useState, useEffect } from "react";
// import "../ReadingTimerDialog.css";

// const ReadingTimerDialog = ({ onClose, bookId }) => {
//     const [duration, setDuration] = useState("");
//     const [pagesRead, setPagesRead] = useState("");
//     const [timeLeft, setTimeLeft] = useState(null);
//     const [isRunning, setIsRunning] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);  // Loading state for save button

//     useEffect(() => {
//         let timer;
//         if (isRunning && timeLeft !== null && timeLeft > 0) {
//             timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//         } else if (timeLeft === 0) {
//             alert("Time is up! 🎉");
//             setIsRunning(false);
//         }
//         return () => clearTimeout(timer);
//     }, [isRunning, timeLeft]);

//     const startTimer = () => {
//         if (timeLeft === null && duration > 0) {
//             setTimeLeft(duration * 60);
//         }
//         setIsRunning(true);
//     };

//     const stopTimer = () => {
//         setIsRunning(false);
//     };

//     // ✅ Save progress inside `ReadingTimerDialog.js`
//     const saveReadingProgress = async () => {
//         if (!bookId) {
//             alert("Error: Book ID is missing.");
//             return;
//         }

//         if (!pagesRead || Number(pagesRead) <= 0) {
//             alert("Please enter a valid number of pages.");
//             return;
//         }

//         setIsSaving(true);

//         try {
//             console.log("Updating book progress for book ID:", bookId);

//             const response = await fetch(`http://localhost:8000/book/${bookId}/update-pages`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ pagesRead: Number(pagesRead) }),
//             });

//             const data = await response.json();
//             console.log("Response from server:", data);

//             if (response.ok) {
//                 alert("Pages updated successfully!");
//             } else {
//                 alert(`Error: ${data.message}`);
//             }
//         } catch (error) {
//             console.error("Error updating pages:", error);
//             alert("Failed to update pages. Please try again.");
//         }

//         setIsSaving(false);
//         onClose();  // Close the modal after saving
//     };

//     return (
//         <div className="dialog-box">
//             <button className="close-btn" onClick={onClose}>✖</button> 

//             <h2>Log Reading Session</h2>
//             <p>Track your reading time and progress</p>

//             <div className="timer-section">
//                 <strong>Reading Timer:</strong> <span id="timer">
//                     {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}` : "00:00"}
//                 </span>
//                 <div className="timer-buttons">
//                     <button className="start-timer" onClick={startTimer} disabled={isRunning}>Start Timer</button>
//                     <button className="stop-timer" onClick={stopTimer} disabled={!isRunning}>Stop Timer</button>
//                 </div>
//             </div>

//             <div className="input-section">
//                 <label htmlFor="duration">Duration (min):</label>
//                 <input 
//                     type="number" 
//                     id="duration" 
//                     name="duration"
//                     value={duration}
//                     onChange={(e) => setDuration(e.target.value)}
//                     disabled={isRunning}
//                 />

//                 <label htmlFor="pages-read">Pages Read:</label>
//                 <input 
//                     type="number" 
//                     id="pages-read" 
//                     name="pages-read"
//                     value={pagesRead}
//                     onChange={(e) => setPagesRead(e.target.value)}
//                 />
//             </div>

//             <button 
//                 className="save-session" 
//                 onClick={saveReadingProgress} 
//                 disabled={isSaving}
//             >
//                 {isSaving ? "Saving..." : "Save Session"}
//             </button>
//         </div>
//     );
// };

// export default ReadingTimerDialog;

import { useState, useEffect } from "react";
import "../ReadingTimerDialog.css";

const ReadingTimerDialog = ({ onClose, bookId }) => {
    const [duration, setDuration] = useState("");
    const [pagesRead, setPagesRead] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);  // Loading state for save button

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft !== null && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            alert("Time is up! 🎉");
            setIsRunning(false);
        }
        return () => clearTimeout(timer);
    }, [isRunning, timeLeft]);

    // Prevent scrolling when dialog is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const startTimer = () => {
        if (timeLeft === null && duration > 0) {
            setTimeLeft(duration * 60);
        }
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const saveReadingProgress = async () => {
        if (!bookId) {
            alert("Error: Book ID is missing.");
            return;
        }

        if (!pagesRead || Number(pagesRead) <= 0) {
            alert("Please enter a valid number of pages.");
            return;
        }

        setIsSaving(true);

        try {
            console.log("Updating book progress for book ID:", bookId);

            const response = await fetch(`http://localhost:8000/book/${bookId}/update-pages`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pagesRead: Number(pagesRead) }),
            });

            const data = await response.json();
            console.log("Response from server:", data);

            if (response.ok) {
                alert("Pages updated successfully!");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error updating pages:", error);
            alert("Failed to update pages. Please try again.");
        }

        setIsSaving(false);
        onClose();  // Close the modal after saving
    };

    return (
        <>
            {/* Overlay background */}
            <div className="dialog-overlay" onClick={onClose}></div>
            
            {/* Dialog box */}
            <div className="dialog-box">
                <button className="close-btn" onClick={onClose}>✖</button>

                <h2>Log Reading Session</h2>
                <p>Track your reading time and progress</p>

                <div className="timer-section">
                    <strong>Reading Timer:</strong> <span id="timer">
                        {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}` : "00:00"}
                    </span>
                    <div className="timer-buttons">
                        <button className="start-timer" onClick={startTimer} disabled={isRunning}>Start Timer</button>
                        <button className="stop-timer" onClick={stopTimer} disabled={!isRunning}>Stop Timer</button>
                    </div>
                </div>

                <div className="input-section">
                    <label htmlFor="duration">Duration (min):</label>
                    <input 
                        type="number" 
                        id="duration" 
                        name="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        disabled={isRunning}
                    />

                    <label htmlFor="pages-read">Pages Read:</label>
                    <input 
                        type="number" 
                        id="pages-read" 
                        name="pages-read"
                        value={pagesRead}
                        onChange={(e) => setPagesRead(e.target.value)}
                    />
                </div>

                <button 
                    className="save-session" 
                    onClick={saveReadingProgress} 
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Session"}
                </button>
            </div>
        </>
    );
};

export default ReadingTimerDialog;
