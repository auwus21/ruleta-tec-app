import React, { useState } from 'react';
import './formulario.css';

function Formulario({ onSubmit }) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nombre); // Pasamos el nombre al onSubmit en App.jsx
  };

  return (
    <div id="formulario">
      <form id="miFormulario" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ingrese su nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} // Capturamos el valor del input
          required
        />

        <label htmlFor="tel">Teléfono:</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          pattern="[0-9]{1,12}"
          maxLength="12"
          minLength="10"
          placeholder="Ingrese tu número sin incluir +54"
          required
        />

        <label htmlFor="pedido">Número de pedido:</label>
        <input
          type="text"
          id="pedido"
          name="pedido"
          pattern="P[0-9]{6}"
          maxLength="7"
          minLength="7"
          placeholder="Código de pedido (PXXXXXX)"
          required
        />

        <button type="submit">Enviar</button>
        <div className="term">
          El código de pedido lo puedes encontrar en tu compra. Solo es válida una tirada por pedido.
        </div>
      </form>
    </div>
  );
}

export default Formulario;
