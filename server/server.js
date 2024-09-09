const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Endpoint para validar nombre y pedido
app.post('/api/submit', async (req, res) => {
  const { nombre, pedido } = req.body;

  console.log(`Datos recibidos del cliente: ${nombre}, ${pedido}`);

  try {
    // Llamada al Google Apps Script para validar nombre y pedido
    const response = await fetch('https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec', {
      method: 'POST',
      body: JSON.stringify({ nombre, pedido, verificar: true }), // Añadimos la clave 'verificar'
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log("Respuesta desde Google Apps Script (Validación):", data);

    // Manejar todas las posibles respuestas
    if (data.result === 'already_participated') {
      return res.json({ result: 'already_participated' });
    } else if (data.result === 'invalid') {
      return res.json({ result: 'invalid' });
    } else if (data.result === 'validated') {
      return res.json({ result: 'validated' });
    } else {
      // Manejo de respuestas inesperadas
      return res.json({ result: 'error', message: 'Respuesta inesperada del servidor.' });
    }
  } catch (error) {
    console.error("Error en la solicitud al Apps Script (Validación):", error);
    res.json({ result: 'error', message: error.message });
  }
});

// Endpoint para enviar los datos del premio tras girar la ruleta
app.post('/api/submitPremio', async (req, res) => {
  const { nombre, pedido, premio } = req.body;

  console.log(`Datos del premio recibidos: ${nombre}, ${pedido}, ${premio}`);

  try {
    // Enviar los datos de premio al Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec', {
      method: 'POST',
      body: JSON.stringify({ nombre, pedido, premio }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log("Respuesta desde Google Apps Script (Premio):", data);

    res.json(data);
  } catch (error) {
    console.error("Error en la solicitud al Apps Script (Premio):", error);
    res.json({ result: 'error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
