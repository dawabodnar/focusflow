import { useEffect, useState } from "react";
import "./TodoList.css";

function TodoList({ credential, ActiveTasksId, setActiveTasksId }) {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const API_URL = "http://localhost:5001/api/tasks";

    // Отримати таски
    useEffect(() => {
        const fetchTasks = async () => {
            if (!credential) return;

            try {
                const res = await fetch(`${API_URL}/fetch`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential }),
                });
                const data = await res.json();
                const tasksArray = Array.isArray(data) ? data : [];
                setTasks(tasksArray);
            } catch (err) {
                console.error("Помилка при завантаженні задач:", err);
            }
        };

        fetchTasks();
    }, [credential]);

    const addTask = async () => {
        if (!inputValue.trim()) return; // не дозволяємо пусті таски

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential, text: inputValue.trim() }),
            });
            const newTask = await res.json();
            setTasks(prev => [...prev, newTask]);
            setInputValue("");
        } catch (err) {
            console.error("Помилка при додаванні задачі:", err);
        }
    };

    const removeTask = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { 
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential })
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            setTasks(prev => prev.filter(task => task._id !== id));
            if (ActiveTasksId === id) setActiveTasksId(null);
        } catch (err) {
            console.error("Помилка при видаленні задачі:", err);
        }
    };

    const toggleCompleted = async (task) => {
        try {
            const res = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, completed: !task.completed, credential })
            });
            const updatedTask = await res.json();
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        } catch (err) {
            console.error("Помилка при оновленні задачі:", err);
        }
    };

    return (
        <div className="todo">
            <div className="todo-header">
                <span className="todo-title">Завдання</span>
                <div className="todo-meta">
                    <strong>{tasks.length}</strong> у списку
                </div>
            </div>

            <div className="todo-input-row">
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="add task..."
                    className="todo-input"
                />
                <button className="todo-add-btn" onClick={addTask}>Add</button>
            </div>

            <div className="todo-scroll">
                <ul className="todo-list">
                    {tasks.map(task => (
                        <li
                            key={task._id}
                            onClick={() => setActiveTasksId(task._id)}
                            className={`todo-item ${task._id === ActiveTasksId ? "active" : ""}`}
                        >
                            <span
                                className={`todo-text ${task.completed ? "completed" : ""}`}
                                onClick={(e) => { e.stopPropagation(); toggleCompleted(task); }}
                            >
                                {task.text}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeTask(task._id); }}
                                className="todo-del"
                            >
                                Видалити
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TodoList;