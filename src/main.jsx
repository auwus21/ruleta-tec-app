import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente principal de tu aplicación
import { Analytics } from "@vercel/analytics/react"


// Crea el root y renderiza la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
