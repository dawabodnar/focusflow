import { useState } from "react";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList"
import "./index.css";
import { Link } from "react-router-dom";
function PomodoroTodoApp() {

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : []
  });
  const [ActiveTasksId, setActiveTasksId] = useState(null)

  const handlePomododroComplete = () => {
    if (ActiveTasksId === null) return;
    setTasks(prevTasks =>
      prevTasks.map(task => task.id === ActiveTasksId ? { ...task, completed: true } : task))
  }
  return (
    <div className="app">

      <Pomodoro onPomodoroComplete={handlePomododroComplete} />
      <TodoList
        tasks={tasks}
        setTasks={setTasks}
        ActiveTasksId={ActiveTasksId}
        setActiveTasksId={setActiveTasksId} />

      <Link to="/" className="btn-home"> Головна</Link>

    </div>
  )
}

export default PomodoroTodoApp;
