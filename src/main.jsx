import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId="1096109517154-eksa9mvn0tmqnefe3foig4e5bj6hola9.apps.googleusercontent.com">
    <App />
   </GoogleOAuthProvider>,
);
