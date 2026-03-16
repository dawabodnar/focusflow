import { BrowserRouter, Routes, Route } from "react-router-dom";
import PomodoroTodoApp from "./PomodoroTodoApp";
import Home from "./Home";
import Auth from "./Auth";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app" element={<PomodoroTodoApp />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}