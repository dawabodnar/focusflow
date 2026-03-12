import { useEffect, useState } from "react";
import "./TodoList.css";
function TodoList({ tasks, setTasks, ActiveTasksId, setActiveTasksId }) {
    const [inputValue, setInputValue] = useState("");

    const addTask = () => {
        if (!inputValue) return;
        const newTask = {
            id: Date.now(),
            text: inputValue,
            completed: false
        };
        setTasks([...tasks, newTask]);
        setInputValue("");
    };


    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))

    }, [tasks])

    const toogleTask = (id) => {
        setActiveTasksId(id)
    }

    const removeTasks = (id) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        if (ActiveTasksId === id) {
            setActiveTasksId(null);
        }
    }

    return (
        <div className="todo">
            <div className="todo-header">
                <span className="todo-title">Завдання</span>
                <div className="todo-meta">
                    <strong>{tasks.length}</strong> у списку
                </div>
            </div>
            <div className="todo-input-row">
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="add task..." className="todo-input" />
                <button className="todo-add-btn" onClick={addTask}>Add</button>
            </div>
            <div className="todo-scroll">
                <ul className="todo-list">
                    {tasks.map(task => (
                        <li key={task.id} onClick={() => toogleTask(task.id)} className={` todo-item ${task.id === ActiveTasksId ? "active" : ""}`}>
                            <span className={`todo-text ${task.completed ? "completed" : ""}`}>{task.text}</span>
                            <button onClick={() => removeTasks(task.id)} className="todo-del">Видалити</button>
                        </li>))}
                </ul>
            </div>
        </div>
    )


} export default TodoList;