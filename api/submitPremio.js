import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { nombre, pedido, premio } = req.body;

  console.log(`Datos del premio recibidos: ${nombre}, ${pedido}, ${premio}`);

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxPNR9q-eoybvzQXX1S52cax-CI3pEegYmamVOK6GDoKkeW8ZSv0M4FRPjLk5OWsDqL/exec', {
      method: 'POST',
      body: JSON.stringify({ nombre, pedido, premio }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log("Respuesta desde Google Apps Script (Premio):", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error en la solicitud al Apps Script (Premio):", error);
    res.status(500).json({ result: 'error', message: error.message });
  }
}
