import { useEffect, useState } from "react";
import "./TodoList.css";

const PRIORITY_LABELS = {
    high: "високий",
    medium: "середній",
    low: "низький",
};

function TodoList({ credential, ActiveTasksId, setActiveTasksId, userId, onTasksChange }) {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [priority, setPriority] = useState("medium");
    const [deadline, setDeadline] = useState("");

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const API_URL = "https://focusflow-1-xxwp.onrender.com/api/tasks";

    useEffect(() => {
        if (onTasksChange) onTasksChange(tasks);
    }, [tasks, onTasksChange]);

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
                    setTasks(Array.isArray(data) ? data : []);
                } catch (err) {
                    console.error("Помилка при завантаженні задач:", err);
                }
            };

            fetchTasks();

            const eventSource = new EventSource(`${API_URL}/events`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.userId === userId) fetchTasks();
            };

            return () => eventSource.close();
        } else {
            const localTasks = JSON.parse(localStorage.getItem("localTasks") || "[]");
            setTasks(localTasks);
        }
    }, [credential, userId]);

    useEffect(() => {
        if (!credential) {
            localStorage.setItem("localTasks", JSON.stringify(tasks));
        }
    }, [tasks, credential]);

    const addTask = async () => {
        if (!inputValue.trim()) return;

        if (credential) {
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        credential,
                        text: inputValue.trim(),
                        priority,
                        deadline: deadline || null,
                    }),
                });

                const newTask = await res.json();
                setTasks((prev) => [...prev, newTask]);
            } catch (err) {
                console.error("Помилка при додаванні задачі:", err);
            }
        } else {
            const newTask = {
                _id: Date.now().toString(),
                text: inputValue.trim(),
                completed: false,
                priority,
                deadline: deadline || null,
            };

            setTasks((prev) => [...prev, newTask]);
        }

        setInputValue("");
        setDeadline("");
        setPriority("medium");
    };

    const removeTask = async (id) => {
        if (credential) {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential }),
                });

                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

                setTasks((prev) => prev.filter((task) => task._id !== id));

                if (ActiveTasksId === id) setActiveTasksId(null);
            } catch (err) {
                console.error("Помилка при видаленні задачі:", err);
            }
        } else {
            setTasks((prev) => prev.filter((task) => task._id !== id));

            if (ActiveTasksId === id) setActiveTasksId(null);
        }
    };

    const toggleCompleted = async (task) => {
        if (credential) {
            try {
                const res = await fetch(`${API_URL}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...task, completed: !task.completed, credential }),
                });

                const updatedTask = await res.json();

                setTasks((prev) =>
                    prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
                );
            } catch (err) {
                console.error("Помилка при оновленні задачі:", err);
            }
        } else {
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                )
            );
        }
    };

    const startEdit = (task) => {
        setEditingTaskId(task._id);
        setEditingText(task.text);
    };

    const saveEdit = async (task) => {
        if (!editingText.trim()) return;

        if (credential) {
            try {
                const res = await fetch(`${API_URL}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...task,
                        text: editingText,
                        credential,
                    }),
                });

                const updatedTask = await res.json();

                setTasks((prev) =>
                    prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
                );
            } catch (err) {
                console.error("Помилка редагування:", err);
            }
        } else {
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, text: editingText } : t
                )
            );
        }

        setEditingTaskId(null);
        setEditingText("");
    };

    const formatDeadline = (date) => {
        if (!date) return null;

        return new Date(date).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="add task..."
                    className="todo-input"
                />

                <select
                    className="todo-priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">Високий</option>
                    <option value="medium">Середній</option>
                    <option value="low">Низький</option>
                </select>

                <input
                    type="date"
                    className="todo-deadline-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <button className="todo-add-btn" onClick={addTask}>
                    Add
                </button>
            </div>

            <div className="todo-scroll">
                <ul className="todo-list">
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            onClick={() => setActiveTasksId(task._id)}
                            className={`todo-item ${task._id === ActiveTasksId ? "active" : ""
                                }`}
                        >
                            <div
                                className={`todo-priority-bar priority-${task.priority || "medium"
                                    }`}
                            />

                            <div className="todo-content">
                                {editingTaskId === task._id ? (
                                    <input
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="todo-edit-input"
                                    />
                                ) : (
                                    <span
                                        className={`todo-text ${task.completed ? "completed" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCompleted(task);
                                        }}
                                    >
                                        {task.text}
                                    </span>
                                )}

                                {task.deadline && (
                                    <span className="todo-deadline">
                                        до {formatDeadline(task.deadline)}
                                    </span>
                                )}
                            </div>

                            <span
                                className={`todo-priority-badge priority-badge-${task.priority || "medium"
                                    }`}
                            >
                                {PRIORITY_LABELS[task.priority || "medium"]}
                            </span>

                            {editingTaskId === task._id ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        saveEdit(task);
                                    }}
                                    className="todo-del"
                                >
                                    Зберегти
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEdit(task);
                                    }}
                                    className="todo-del"
                                >
                                    Редагувати
                                </button>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTask(task._id);
                                }}
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