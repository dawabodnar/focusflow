import { useState, useEffect } from "react";
import "./Pomodoro.css";

const MODES = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
}

const MODE_LABELS = {
    pomodoro: "Фокус",
    shortBreak: "Коротка перерва",
    longBreak: "Довга перерва",
};

function Pomodoro({ onPomodoroComplete }) {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem("mode");
        return savedMode ? savedMode : "pomodoro";
    });
    const [isRunning, setIsRunning] = useState(false);
    const [IsTime, setIsTime] = useState(() => {
        const savedTime = localStorage.getItem("time");
        return savedTime ? Number(savedTime) : MODES[mode];
    });

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setIsTime(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    setIsRunning(false);
                    if (onPomodoroComplete && mode === "pomodoro") {
                        onPomodoroComplete();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);

    }, [isRunning, mode, onPomodoroComplete]);


    useEffect(() => {
        localStorage.setItem("time", IsTime);
        localStorage.setItem("mode", mode);
    }, [IsTime, mode])


    const formatTime = () => {
        const minutes = Math.floor(IsTime / 60);
        const seconds = IsTime % 60;
        return `${minutes}: ${seconds.toString().padStart(2, "0")}`
    }

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setIsTime(MODES[newMode]);
        setIsRunning(false);
    }

    return (
        <div className={`pomodoro ${mode}`}>

            <div className="pom-modes">
                <button className={`pom-mode-btn ${mode === "pomodoro" ? "active" : ""}`} onClick={() => handleModeChange("pomodoro")}>Pomodoro</button>
                <button className={`pom-mode-btn ${mode === "shortBreak" ? "active" : ""}`} onClick={() => handleModeChange("shortBreak")}>Short Break</button>
                <button className={`pom-mode-btn ${mode === "longBreak" ? "active" : ""}`} onClick={() => handleModeChange("longBreak")}>Long Break</button>
            </div>
            <div className="pom-body">
                <div className="pom-eyebrow">{MODE_LABELS[mode]}</div>
                <div className="pom-clock">{formatTime()}</div>
                <div className="pom-controls">
                    <button onClick={() => setIsRunning(true)} className="pom-btn pom-start">Start</button>
                    <button onClick={() => setIsRunning(false)} className="pom-btn">Pause</button>
                    <button onClick={() => {
                        setIsTime(MODES[mode]);
                        setIsRunning(false);
                    }} className="pom-btn">Reset</button>
                </div>
            </div>
        </div>
    )


} export default Pomodoro;