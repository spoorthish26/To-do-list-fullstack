import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the keyframes for the moving effect
const movingStyle = `
  @keyframes moveTask {
    from { transform: translateX(100%); }
    to { transform: translateX(-100%); }
  }
`;

// Apply the animation globally
const MovingText = () => <style>{movingStyle}</style>;

const API_URL = "http://127.0.0.1:8000/tasks/";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter both fields!");
      return;
    }

    const newTask = {
      id: Date.now(), // Generate unique ID
      title,
      description,
    };

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Task added successfully:", response.data);
      setTasks([...tasks, response.data]); // Update task list instantly
      setTitle(""); // Clear input fields
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Check console for details.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      setTasks(tasks.filter(task => task.id !== id)); // Remove task instantly
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <MovingText /> {/* This ensures the animation styles are applied */}
      <div style={styles.container}>
        <h1 style={styles.title}>To-Do List</h1>

        {/* Task Input Section */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            style={styles.input}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul style={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} style={styles.taskItem}>
              <div>
                <strong>{task.title}:</strong> {task.description}
              </div>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to right, #FF0000, #FFD700)", // Red to Yellow gradient
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensures animation stays visible
  },
  title: {
    fontSize: "50px",
    fontWeight: "bold",
    textShadow: "3px 3px 10px rgba(0,0,0,0.3)",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 6px 12px rgba(0,0,0,0.3)",
    width: "50%",
  },
  input: {
    padding: "15px",
    fontSize: "20px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    outline: "none",
    color: "black",
    fontWeight: "bold",
  },
  addButton: {
    padding: "15px",
    fontSize: "20px",
    backgroundColor: "#008000", // Green Button
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
  },
  addButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
  },
  taskList: {
    listStyleType: "none",
    padding: "0",
    marginTop: "30px",
    width: "70%",
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
  },
  taskItem: {
    background: "rgba(255, 255, 255, 0.8)",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    display: "inline-block", // Important for animation
    fontSize: "22px",
    fontWeight: "bold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    animation: "moveTask 10s linear infinite", // Ensure animation is applied
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#008000",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default App;
