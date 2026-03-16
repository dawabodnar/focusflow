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
    const [editingPriority, setEditingPriority] = useState("medium");
    const [editingDeadline, setEditingDeadline] = useState("");

    const API_URL = "https://focusflow-1-xxwp.onrender.com/api/tasks";

    // передаємо оновлення в батьківський компонент
    useEffect(() => {
        if (onTasksChange) onTasksChange(tasks);
    }, [tasks, onTasksChange]);

    // завантаження задач
    useEffect(() => {
        const fetchTasks = async () => {
            if (!credential) {
                const localTasks = JSON.parse(localStorage.getItem("localTasks") || "[]");
                setTasks(localTasks);
                return;
            }
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

        if (credential) {
            const eventSource = new EventSource(`${API_URL}/events`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.userId === userId) fetchTasks();
            };
            return () => eventSource.close();
        }
    }, [credential, userId]);

    // збереження локально для незалогінених
    useEffect(() => {
        if (!credential) {
            localStorage.setItem("localTasks", JSON.stringify(tasks));
        }
    }, [tasks, credential]);

    const addTask = async () => {
        if (!inputValue.trim()) return;

        const newTaskPayload = {
            text: inputValue.trim(),
            priority,
            deadline: deadline || null,
        };

        if (credential) {
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...newTaskPayload, credential }),
                });
                const newTask = await res.json();
                setTasks((prev) => [...prev, newTask]);
            } catch (err) {
                console.error("Помилка при додаванні задачі:", err);
            }
        } else {
            const newTask = {
                _id: Date.now().toString(),
                completed: false,
                ...newTaskPayload,
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
            } catch (err) {
                console.error("Помилка при видаленні задачі:", err);
            }
        }
        setTasks((prev) => prev.filter((task) => task._id !== id));
        if (ActiveTasksId === id) setActiveTasksId(null);
    };

    const toggleCompleted = async (task) => {
        const updatedTaskPayload = { ...task, completed: !task.completed };
        if (credential) {
            try {
                const res = await fetch(`${API_URL}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...updatedTaskPayload, credential }),
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
                prev.map((t) => (t._id === task._id ? updatedTaskPayload : t))
            );
        }
    };

    const startEdit = (task) => {
        setEditingTaskId(task._id);
        setEditingText(task.text);
        setEditingPriority(task.priority || "medium");
        setEditingDeadline(task.deadline ? task.deadline.split("T")[0] : "");
    };

    const saveEdit = async (task) => {
        if (!editingText.trim()) return;

        const updatedTaskPayload = {
            text: editingText,
            priority: editingPriority,
            deadline: editingDeadline || null,
        };

        if (credential) {
            try {
                const res = await fetch(`${API_URL}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...task, ...updatedTaskPayload, credential }),
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
                    t._id === task._id ? { ...t, ...updatedTaskPayload } : t
                )
            );
        }

        setEditingTaskId(null);
        setEditingText("");
        setEditingPriority("medium");
        setEditingDeadline("");
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
                            className={`todo-item ${task._id === ActiveTasksId ? "active" : ""}`}
                        >
                            <div
                                className={`todo-priority-bar priority-${task.priority || "medium"}`}
                            />

                            <div className="todo-content">
                                {editingTaskId === task._id ? (
                                    <div className="todo-edit-row">
                                        <input
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="todo-edit-input"
                                        />
                                        <select
                                            value={editingPriority}
                                            onChange={(e) => setEditingPriority(e.target.value)}
                                            className="todo-edit-priority-select"
                                        >
                                            <option value="high">Високий</option>
                                            <option value="medium">Середній</option>
                                            <option value="low">Низький</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={editingDeadline}
                                            onChange={(e) => setEditingDeadline(e.target.value)}
                                            className="todo-edit-deadline-input"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                saveEdit(task);
                                            }}
                                            className="todo-del"
                                        >
                                            Зберегти
                                        </button>
                                    </div>
                                ) : (
                                    
                                    <span
                                        className={`todo-text ${task.completed ? "completed" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCompleted(task);
                                        }}
                                    >
                                        {task.text}
                                        {task.deadline && (
                                            <span className="todo-deadline">
                                                до {formatDeadline(task.deadline)}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>

                            <span
                                className={`todo-priority-badge priority-badge-${task.priority || "medium"}`}
                            >
                                {PRIORITY_LABELS[task.priority || "medium"]}
                            </span>

                            {editingTaskId !== task._id && (
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