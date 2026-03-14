import { useEffect, useState } from "react";
import "./TodoList.css";

function TodoList({ credential, ActiveTasksId, setActiveTasksId }) {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const API_URL = "http://localhost:5001/api/tasks";

    useEffect(() => {
        if (credential) {
            const fetchTasks = async () => {
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
        } else {
            const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
            setTasks(localTasks);
        }
    }, [credential]);

    // Зберігати локальні таски в localStorage
    useEffect(() => {
        if (!credential) {
            localStorage.setItem('localTasks', JSON.stringify(tasks));
        }
    }, [tasks, credential]);

    const addTask = async () => {
        if (!inputValue.trim()) return;

        if (credential) {
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
        } else {
            const newTask = {
                _id: Date.now().toString(),
                text: inputValue.trim(),
                completed: false,
            };
            setTasks(prev => [...prev, newTask]);
            setInputValue("");
        }
    };

    const removeTask = async (id) => {
        if (credential) {
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
        } else {
            setTasks(prev => prev.filter(task => task._id !== id));
            if (ActiveTasksId === id) setActiveTasksId(null);
        }
    };

    const toggleCompleted = async (task) => {
        if (credential) {
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
        } else {
            setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));
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