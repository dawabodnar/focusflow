import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = "https://focusflow-1-xxwp.onrender.com/api/auth";

    const handleSubmit = async () => {
        setError("");
        if (!email || !password || (!isLogin && !name)) {
            setError("Заповніть всі поля");
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? "/login" : "/register";
        const body = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Помилка");
                return;
            }

            localStorage.setItem("credential", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);

            navigate("/app", { state: { credential: data.token, userId: data.userId } });
        } catch (err) {
            console.error(err);
            setError("Сервер прокидається, зачекайте 30 секунд і спробуйте ще раз");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-letter">F</div>
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? "active" : ""}`}
                        onClick={() => { setIsLogin(true); setError(""); }}
                    >
                        Вхід
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? "active" : ""}`}
                        onClick={() => { setIsLogin(false); setError(""); }}
                    >
                        Реєстрація
                    </button>
                </div>

                <div className="auth-form">
                    {!isLogin && (
                        <input
                            className="auth-input"
                            placeholder="Ім'я"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <input
                        className="auth-input"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button
                        className="auth-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Завантаження..." : (isLogin ? "Увійти" : "Зареєструватись")}
                    </button>
                </div>
            </div>
        </div>
    );
}