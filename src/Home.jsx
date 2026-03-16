import { Link } from "react-router-dom";
import "./Home.css";
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";

export default function Home() {
    const [credential, setCredential] = useState(localStorage.getItem('credential'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

const handleLoginSuccess = (credentialResponse) => {
    const cred = credentialResponse.credential;
    setCredential(cred);
    localStorage.setItem('credential', cred);

    try {
        // FedCM може повертати не JWT - витягуємо userId інакше
        const parts = cred.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const uid = payload.sub;
            setUserId(uid);
            localStorage.setItem('userId', uid);
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
};

    const handleLogout = () => {
        setCredential(null);
        setUserId(null);
        localStorage.removeItem('credential');
        localStorage.removeItem('userId');
    };
    return (
        <div className="home">
            <header className="hero">
                <div className="hero-bg-letter">F</div>
                <div className="auth-buttons">
                    {!credential && (
                        <div className="google-login-wrapper">
                            <GoogleLogin
                                className="google-login-btn"
                                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                                onSuccess={handleLoginSuccess}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
                        </div>
                    )}
                    {credential && (
                        <button onClick={handleLogout} className="btn-logout">Вийти</button>
                    )}
                </div>
                <div className="hero-body">
                    <div className="hero-eyebrow">Фокус та продуктивність</div>
                    <h1> Focus<em>Flow</em></h1>

                    <p className="hero-desc">Застосунок для глибокої роботи на основі техніки Помодоро.
                        Плануйте, фокусуйтесь і відслідковуйте — все в одному місці.</p>

                    <Link
                        to="/app"
                        state={{ credential, userId }}
                        className="start-button"
                    >
                        Почати роботу
                    </Link>



                    <div className="hero-scroll-down">
                        <div className="hero-scroll-line"></div>
                        <span className="hero-scroll-label">Дізнатись більше</span>
                        <div className="hero-scroll-circle">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1v8M2 6l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            <section className="about">
                <div className="about-top">
                    <h2>Що таке метод Помодоро?</h2>
                </div>
                <div className="about-cols">
                    <div className="about-col">
                        <p>
                            <strong>Техніка Помодоро</strong> — це метод управління часом, розроблений
                            Франческо Чірілло наприкінці 1980-х. Назва походить від кухонного таймера
                            у формі томата (<em>pomodoro</em> по-італійськи), який він використовував студентом.
                        </p>
                        <p>
                            Суть проста: розбийте роботу на <strong>25-хвилинні блоки</strong> повного фокусу,
                            розділені короткими перервами. Це знижує розумову втому, підтримує концентрацію
                            і дає відчуття прогресу після кожного завершеного блоку.
                        </p>
                    </div>
                    <div className="about-col">
                        <p>
                            Мозок не призначений для годин безперервної роботи. Короткі, структуровані
                            перерви допомагають <strong>відновити увагу</strong> і уникнути вигоряння —
                            на відміну від хаотичних відволікань, які тільки ламають потік.

                        </p>
                        <blockquote className="about-quote">
                            «Наступні кілька хвилин належать тобі. Зроби одне завдання. Потім відпочинь. Повтори.»
                        </blockquote>
                    </div>
                </div>
            </section>

            <div className="section-strip">
                <div className="section-strip-line"></div>
                <div className="section-strip-label"> — Інструкція —  </div>
                <div className="section-strip-line"></div>
            </div>

            <section className="how">
                <div className="how-header">
                    <div className="how-header-left">
                        <h2>Як це працює?</h2>
                    </div>
                </div>
                <div className="steps">
                    <div className="step-cart">
                        <h3>Оберіть завдання</h3>
                        <p>Додайте завдання до списку і виберіть те, на якому хочете зосередитись
                            прямо зараз. Один фокус — один результат.</p>
                        <div className="step-detail">
                            Порада: розбивайте великі задачі на дрібніші, щоб завершувати по одній за сесію.
                        </div>
                    </div>
                    <div className="step-cart">
                        <h3>Почніть Pomodoro</h3>
                        <p>Запустіть таймер на 25 хвилин і працюйте без відволікань. Телефон убік,
                            сповіщення вимкнені — тільки ти і завдання.</p>
                        <div className="step-detail">
                            Якщо з'явилась інша думка — запишіть її і поверніться до фокусу.
                        </div>
                    </div>
                    <div className="step-cart">
                        <h3>Відпочиньте та відслідкуйте</h3>
                        <p>Після сигналу — 5 хвилин перерви. Після 4 циклів — довга перерва 15 хвилин.
                            Позначайте виконані завдання і бачте свій прогрес.</p>
                        <div className="step-detail">
                            Перерва — це не слабкість. Це частина системи.
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}