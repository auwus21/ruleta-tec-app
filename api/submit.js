const fetch = require('node-fetch');

export default async function handler(req, res) {
  const { nombre, pedido } = req.body;

  console.log(`Datos recibidos del cliente: ${nombre}, ${pedido}`);

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec', {
      method: 'POST',
      body: JSON.stringify({ nombre, pedido, verificar: true }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log("Respuesta desde Google Apps Script (Validación):", data);

    if (data.result === 'already_participated') {
      return res.status(200).json({ result: 'already_participated' });
    } else if (data.result === 'invalid') {
      return res.status(200).json({ result: 'invalid' });
    } else if (data.result === 'validated') {
      return res.status(200).json({ result: 'validated' });
    } else {
      return res.status(500).json({ result: 'error', message: 'Respuesta inesperada del servidor.' });
    }
  } catch (error) {
    console.error("Error en la solicitud al Apps Script (Validación):", error);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}