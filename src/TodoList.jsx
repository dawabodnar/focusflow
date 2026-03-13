import { useEffect, useState } from "react";
import "./TodoList.css";

function TodoList({ userId, ActiveTasksId, setActiveTasksId }) {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const API_URL = "https://focusflow-1-xxwp.onrender.com/api/tasks"; // змінити на деплойну адресу після розгортання

    //  Отримати задачі з серверу 
    useEffect(() => {
        const fetchTasks = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${API_URL}/${userId}`);

                if (!res.ok) {
                    throw new Error("Помилка отримання задач");
                }

                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, [userId]);

    // Додати нову задачу 
    const addTask = async () => {
        if (!inputValue) return;
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    text: inputValue,
                    completed: false
                })
            });
            const newTask = await res.json();
            setTasks(prev => [...prev, newTask]);
            setInputValue("");
        } catch (err) {
            console.error("Помилка при додаванні задачі:", err);
        }
    };

    // Перемкнути активну задачу 
    const toggleTask = (id) => {
        setActiveTasksId(id);
    };

    //  Видалити задачу 
    const removeTask = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setTasks(prev => prev.filter(task => task._id !== id));
            if (ActiveTasksId === id) setActiveTasksId(null);
        } catch (err) {
            console.error("Помилка при видаленні задачі:", err);
        }
    };

    //  Позначити виконаною 
    const toggleCompleted = async (task) => {
        try {
            const res = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, completed: !task.completed })
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
                            onClick={() => toggleTask(task._id)}
                            className={`todo-item ${task._id === ActiveTasksId ? "active" : ""}`}
                        >
                            <span
                                className={`todo-text ${task.completed ? "completed" : ""}`}
                                onClick={(e) => { e.stopPropagation(); toggleCompleted(task); }}
                            >
                                {task.text}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); removeTask(task._id); }} className="todo-del">
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