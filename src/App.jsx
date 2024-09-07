import React, { useState } from 'react';
import Ruleta from './Wheel'; 
import Formulario from './Formulario';
import Felicitaciones from './Felicitaciones';
import './fondo.css';
import './formulario.css';

function App() {
  const [mostrarRuleta, setMostrarRuleta] = useState(false); 
  const [nombreUsuario, setNombreUsuario] = useState(''); 
  const [premioGanado, setPremioGanado] = useState(''); 
  const [imagenPremio, setImagenPremio] = useState('');
  const [mostrarFelicitaciones, setMostrarFelicitaciones] = useState(false); 

  const handleFormSubmit = (nombre) => {
    setNombreUsuario(nombre);
    setMostrarRuleta(true);
  };

  const handlePremioGanado = (premio, imagen) => {
    setPremioGanado(premio);
    setImagenPremio(imagen);

    // Agregar un retraso de 2 segundos antes de mostrar el componente de felicitaciones
    setTimeout(() => {
      setMostrarFelicitaciones(true);
    }, 1000); // 2000 milisegundos = 2 segundos
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