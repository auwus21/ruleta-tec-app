import React, { useState } from 'react';
import './formulario.css';

function Formulario({ onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [pedido, setPedido] = useState(''); // Estado para el número de pedido

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nombre, pedido); // Pasamos el nombre y el pedido al onSubmit en App.jsx
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

        <label htmlFor="pedido">Número de pedido:</label>
        <input
          type="text"
          id="pedido"
          name="pedido"
          pattern="P[0-9]{6}"
          maxLength="7"
          minLength="7"
          placeholder="Código de pedido (PXXXXXX)"
          value={pedido} // Capturamos el valor del input de pedido
          onChange={(e) => setPedido(e.target.value)}
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
