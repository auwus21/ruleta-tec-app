import React, { useState } from 'react';
import Ruleta from './Wheel'; 
import Formulario from './Formulario';
import Felicitaciones from './Felicitaciones';
import './fondo.css';
import './formulario.css';

function App() {
  const [mostrarRuleta, setMostrarRuleta] = useState(false); 
  const [nombreUsuario, setNombreUsuario] = useState(''); 
  const [pedidoUsuario, setPedidoUsuario] = useState(''); 
  const [premioGanado, setPremioGanado] = useState(''); 
  const [imagenPremio, setImagenPremio] = useState('');
  const [mostrarFelicitaciones, setMostrarFelicitaciones] = useState(false); 

  // Función para manejar el envío del formulario y realizar la validación
  const handleFormSubmit = (nombre, pedido) => {
    // Realizar solicitud al Apps Script para verificar nombre y pedido
    fetch('https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec', {
      method: 'POST',
      body: JSON.stringify({ nombre, pedido }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())  // Ahora verificamos la respuesta
    .then(data => {
      if (data.result === 'success') {
        // Si la verificación es correcta, mostrar la ruleta
        setNombreUsuario(nombre);
        setPedidoUsuario(pedido);
        setMostrarRuleta(true);
      } else if (data.result === 'already_participated') {
        alert("Ya has participado con este pedido.");
      } else {
        alert("El nombre y el número de pedido no coinciden.");
      }
    })
    .catch(error => {
      console.error("Error en la verificación:", error);
    });
  };

  // Función para manejar el resultado de la ruleta y enviar los datos a Google Sheets
  const handlePremioGanado = (premio, imagen) => {
    setPremioGanado(premio);
    setImagenPremio(imagen);

    // Enviar los datos del premio a Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec", {
      method: "POST",
      body: JSON.stringify({
        nombre: nombreUsuario,
        pedido: pedidoUsuario,
        premio: premio,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log("Datos enviados correctamente:", data);
    })
    .catch(error => {
      console.error("Error enviando datos:", error);
    });

    // Agregar un retraso de 2 segundos antes de mostrar el componente de felicitaciones
    setTimeout(() => {
      setMostrarFelicitaciones(true);
    }, 1000); // 1000 milisegundos = 1 segundo
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
