import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './felicitaciones.css';
import whatsappIcon from '/img/whatsapp.png'; // Asegúrate de que el ícono esté en la carpeta correcta

const Felicitaciones = ({ nombre, premio, imagenPremio }) => {
  const [mostrarAgradecimiento, setMostrarAgradecimiento] = useState(false);
  
  useEffect(() => {
    console.log("Componente Felicitaciones renderizado");
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#bb0000', '#ffffff'],
    });
  }, []);
  

  const handleContinuar = () => {
    setMostrarAgradecimiento(true); // Muestra la pantalla de agradecimiento
  };

  return (
    <div className="felicitaciones-overlay">
      {!mostrarAgradecimiento ? (
        <div className="felicitaciones-container">
          <h2>¡{premio === "Sera la proxima..." ? "Será la próxima..." : `Felicitaciones`}!</h2>
          <div className="premio-container">
            <img src={imagenPremio} alt={premio} className="imagen-premio" />
            {premio !== "Sera la proxima..." && <p>Ganaste: {premio}</p>}
          </div>
          <button className="continuar-btn" onClick={handleContinuar}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="agradecimiento-container">
          <h2>Muchas Gracias por participar de la ruleta Tec Store</h2>
          <p>
            Para reclamar tu premio comunicate por alguna de nuestras redes
            mandando el código de pedido y tu nombre completo.
          </p>
          <div className="social-buttons">
            <a
              href="https://wa.me/5491130200515"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="social-icon" />
            </a>
          </div>
        </div>
      )}
    </div>
  );  
};

export default Felicitaciones;
