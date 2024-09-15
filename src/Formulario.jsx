import React, { useState } from 'react';
import './formulario.css';

function Formulario({ onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [pedido, setPedido] = useState(''); // Estado para el número de pedido

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que no haya campos vacíos
    if (nombre.trim() === '' || pedido.trim() === '') {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar que el número de pedido siga el formato correcto
    const pedidoRegex = /^P[0-9]{6}$/;
    if (!pedidoRegex.test(pedido)) {
      alert("El número de pedido debe seguir el formato PXXXXXX.");
      return;
    }

    // Enviar los datos al componente padre (App.jsx)
    onSubmit(nombre.trim(), pedido.trim()); // Asegúrate de que no haya espacios en blanco al principio o al final
  };

  return (
    <div id="formulario">
      <form id="miFormulario" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Codigo:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ingrese el codigo de tirada (RXXXX)"
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
          placeholder="Número de pedido (PXXXXXX)"
          value={pedido} // Capturamos el valor del input de pedido
          onChange={(e) => setPedido(e.target.value)}
          required
        />

        <button type="submit">Enviar</button>
        <div className="term">
        El código y el número de pedido están en tu compra, solo es valido una tirada por compra!
        </div>
      </form>
    </div>
  );
}

export default Formulario;
