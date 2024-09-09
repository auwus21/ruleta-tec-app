import React, { useState } from 'react';
import Ruleta from './Wheel'; 
import Formulario from './Formulario';
import Felicitaciones from './Felicitaciones';
import './fondo.css';
import './formulario.css';

function App() {
  const [mostrarRuleta, setMostrarRuleta] = useState(false); 
  const [nombreUsuario, setNombreUsuario] = useState(''); 
  const [pedidoUsuario, setPedidoUsuario] = useState(''); // Nueva variable para el número de pedido
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
      mode: 'no-cors',  // Aquí se agrega el modo 'no-cors'
    })
    .then(response => {
      // Aunque no puedes acceder a la respuesta con 'no-cors', podemos proceder con la lógica.
      console.log("Solicitud enviada, no podemos verificar la respuesta debido a no-cors.");
      // Puedes continuar como si la validación fuera exitosa.
      setNombreUsuario(nombre);
      setPedidoUsuario(pedido);
      setMostrarRuleta(true);
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
      mode: 'no-cors',  // Aquí también agregamos el modo 'no-cors'
    })
    .then(response => {
      console.log("Datos enviados, no podemos verificar la respuesta debido a no-cors.");
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
