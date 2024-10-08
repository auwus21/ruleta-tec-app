import React, { useState } from 'react';
import Ruleta from './Wheel'; 
import Formulario from './Formulario';
import Felicitaciones from './Felicitaciones';
import './fondo.css';
import './formulario.css';

const API_URL = 'https://ruleta-tec-app.vercel.app/api';

function App() {
  const [mostrarRuleta, setMostrarRuleta] = useState(false); 
  const [nombreUsuario, setNombreUsuario] = useState(''); 
  const [pedidoUsuario, setPedidoUsuario] = useState(''); 
  const [premioGanado, setPremioGanado] = useState(''); 
  const [imagenPremio, setImagenPremio] = useState('');
  const [mostrarFelicitaciones, setMostrarFelicitaciones] = useState(false); 

  // Función para manejar el envío del formulario y realizar la validación
  const handleFormSubmit = (nombre, pedido) => {
    fetch(`${API_URL}/submit`, {  // <-- Cambié las comillas por backticks
      method: 'POST',
      body: JSON.stringify({ nombre, pedido }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'validated') {
        setNombreUsuario(nombre);
        setPedidoUsuario(pedido);
        setMostrarRuleta(true);
      } else if (data.result === 'invalid') {
        alert("El codigo o pedido no coinciden.");
      } else if (data.result === 'already_participated') {
        alert("Ya has participado con este pedido. No puedes volver a jugar.");
      } else if (data.result === 'error') {
        alert(`Error: ${data.message}`);
      } else {
        alert("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
      }
    })
    .catch(error => {
      console.error("Error en la verificación:", error);
      alert("Error en la verificación. Por favor, intenta nuevamente.");
    });
  };

  // Función para manejar el resultado de la ruleta y enviar los datos a Google Sheets
  const handlePremioGanado = (premio, imagen) => {
    fetch(`${API_URL}/submitPremio`, {  // <-- Cambié las comillas por backticks
      method: 'POST',
      body: JSON.stringify({
        nombre: nombreUsuario,
        pedido: pedidoUsuario,
        premio: premio,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        console.log("Premio registrado exitosamente.");
        setPremioGanado(premio);
        setImagenPremio(imagen);
        setMostrarFelicitaciones(true);
      } else if (data.result === 'already_participated') {
        alert("Ya has participado con este pedido y tu premio ya fue registrado.");
      } else if (data.result === 'invalid') {
        alert("Datos inválidos al registrar el premio.");
      } else if (data.result === 'error') {
        alert(`Error al registrar el premio: ${data.message}`);
      } else {
        alert("Ocurrió un error inesperado al registrar el premio.");
      }
    })
    .catch(error => {
      console.error("Error enviando datos del premio:", error);
      alert("Error enviando datos del premio. Por favor, intenta nuevamente.");
    });
  };

  return (
    <div>
      {!mostrarRuleta ? (
        <Formulario onSubmit={handleFormSubmit} />
      ) : (
        <>
          <Ruleta onPremioGanado={handlePremioGanado} />
          {mostrarFelicitaciones && (
            <Felicitaciones nombre={nombreUsuario} premio={premioGanado} imagenPremio={imagenPremio} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
