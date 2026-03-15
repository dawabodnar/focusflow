import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList";
import "./index.css";

function PomodoroTodoApp() {
  const [ActiveTasksId, setActiveTasksId] = useState(null);

  const location = useLocation();
  const credential = location.state?.credential || localStorage.getItem('credential');
const userId = location.state?.userId || localStorage.getItem('userId'); // <- просто змінна, state не потрібен

  return (
    <div className="app">
      <Pomodoro />
      <TodoList
        ActiveTasksId={ActiveTasksId}
        setActiveTasksId={setActiveTasksId}
        credential={credential}
        userId={userId} 
      />
      <Link to="/" className="btn-home"> Головна</Link>
    </div>
  )
}

export default PomodoroTodoApp;