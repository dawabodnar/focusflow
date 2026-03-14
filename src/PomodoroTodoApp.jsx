import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pomodoro from "./Pomodoro";
import TodoList from "./TodoList";
import "./index.css";

function PomodoroTodoApp() {
    const [ActiveTasksId, setActiveTasksId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const credential = location.state?.credential;

    // Редірект, якщо немає credential
    useEffect(() => {
        if (!credential) navigate("/");
    }, [credential, navigate]);

    if (!credential) return null;

    return (
        <div className="app">
            <Pomodoro />
            <TodoList
                ActiveTasksId={ActiveTasksId}
                setActiveTasksId={setActiveTasksId}
                credential={credential}
            />
        </div>
    )
}

export default PomodoroTodoApp;