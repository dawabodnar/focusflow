import { useState } from "react";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList"
import "./index.css";
import { Link } from "react-router-dom";

function PomodoroTodoApp() {

  const [ActiveTasksId, setActiveTasksId] = useState(null)



  return (
    <div className="app">

      <Pomodoro />
      <TodoList
        ActiveTasksId={ActiveTasksId}
        setActiveTasksId={setActiveTasksId}
        userId="default-user" />

      <Link to="/" className="btn-home"> Головна</Link>

    </div>
  )
}

export default PomodoroTodoApp;
