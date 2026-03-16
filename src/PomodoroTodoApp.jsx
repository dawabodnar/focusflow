import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList";
import "./index.css";

function PomodoroTodoApp() {
  const [ActiveTasksId, setActiveTasksId] = useState(null);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  const location = useLocation();
  const credential = location.state?.credential || localStorage.getItem('credential');
  const userId = location.state?.userId || localStorage.getItem('userId');

  const API_URL = "https://focusflow-1-xxwp.onrender.com";

  useEffect(() => {
    if (!credential) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/stats`, {
          headers: { Authorization: `Bearer ${credential}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [credential]);

  const handlePomodoroComplete = async () => {
    if (!credential) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/stats/pomodoro`, {
        method: "POST",
        headers: { Authorization: `Bearer ${credential}` },
      });
      const data = await res.json();
      setStats(prev => ({ ...prev, pomodoroCount: data.pomodoroCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const focusHours = ((stats?.pomodoroCount || 0) * 25 / 60).toFixed(1);

  return (
    <div className="app">
      <Pomodoro onPomodoroComplete={handlePomodoroComplete} />

      <div className="app-stats">
        <div className="app-stat">
          <span className="app-stat-value">{stats?.pomodoroCount || 0}</span>
          <span className="app-stat-label">помодоро</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-value">{completedTasks}</span>
          <span className="app-stat-label">виконано</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-value">{focusHours}</span>
          <span className="app-stat-label">год фокусу</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-value">{tasks.length}</span>
          <span className="app-stat-label">задач</span>
        </div>
      </div>

      <TodoList
        ActiveTasksId={ActiveTasksId}
        setActiveTasksId={setActiveTasksId}
        credential={credential}
        userId={userId}
        onTasksChange={setTasks}
      />
      <Link to="/" className="btn-home">Головна</Link>
    </div>
  );
}

export default PomodoroTodoApp;