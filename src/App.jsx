import React, { useState } from 'react';
import Ruleta from './Wheel'; // Importa el componente Ruleta
import Formulario from './Formulario';
import './fondo.css';
import './formulario.css';

function App() {
  const [mostrarRuleta, setMostrarRuleta] = useState(false); // Estado para controlar qué mostrar

  const handleFormSubmit = () => {
    // Esta función se ejecutará cuando el formulario sea enviado
    setMostrarRuleta(true); // Cambiar a true para mostrar la ruleta
  };

  return (
    <div>
      {!mostrarRuleta ? (
  // Mostrar formulario si "mostrarRuleta" es false
  <Formulario onSubmit={handleFormSubmit} />
) : (
  // Mostrar la ruleta si "mostrarRuleta" es true
  <Ruleta />
)}
    </div>
  );
}

export default App;
/**/