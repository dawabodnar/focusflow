import { BrowserRouter, Routes, Route } from "react-router-dom";
import PomodoroTodoApp from "./PomodoroTodoApp";
import Home from "./Home";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app" element={<PomodoroTodoApp />} />
            </Routes>
        </BrowserRouter>
    )
}