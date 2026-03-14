import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList";
import "./index.css";

function PomodoroTodoApp() {
  const [ActiveTasksId, setActiveTasksId] = useState(null);

  const location = useLocation();
  const credential = location.state?.credential || localStorage.getItem('credential');

  return (
    <div className="app">
      <Pomodoro />
      <TodoList
        ActiveTasksId={ActiveTasksId}
        setActiveTasksId={setActiveTasksId}
        credential={credential}
      />
      <Link to="/" className="btn-home"> Головна</Link>
    </div>
  )
}

export default PomodoroTodoApp;