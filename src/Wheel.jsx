import React, { useRef, useState, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import confetti from "canvas-confetti"; // Importamos la librería de confeti
import "./wheel.css"; // Importa el archivo CSS

const Wheel = ({ onPremioGanado }) => {
  const wheelRef = useRef(null); // Referencia al canvas
  const chartInstanceRef = useRef(null); // Referencia para almacenar la instancia del gráfico
  const [finalValue, setFinalValue] = useState("Apreta el botón girar para comenzar");
  const [isSpinning, setIsSpinning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Estado para saber si las imágenes se han cargado
  const [hasSpun, setHasSpun] = useState(false); // Controla si el usuario ya giró la ruleta

  const audioRef = useRef(new Audio("/sounds/roulete.wav"));
  const winSoundRef = useRef(new Audio("/sounds/win.wav"));
  

  // Ruta de las imágenes que se mostrarán en cada segmento
  const imageSources = [
    "/img/PremioMenor.png", // Imagen para el segmento 1
    "/img/5descuento.png", // Imagen para el segmento 2
    "/img/PlayoIphone.png", // Imagen para el segmento 3
    "/img/10usd.png", // Imagen para el segmento 4
    "/img/PremioMayor.png", // Imagen para el segmento 5
    "/img/SeguiParticipando.png", // Imagen para el segmento 6
  ];

  const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: "Un 5% de descuento para tu compra", image: "/img/5descuento.png" }, //2
    { minDegree: 31, maxDegree: 90, value: "Premio Menor", image: "/img/PremioMenor.png" }, //1
    { minDegree: 91, maxDegree: 150, value: "Sera la proxima...", image: "/img/SeguiParticipando.png" }, //6
    { minDegree: 151, maxDegree: 210, value: "Premio Mayor", image: "/img/PremioMayor.png" }, //5
    { minDegree: 211, maxDegree: 270, value: "$10 usd de descuento para tu compra", image: "/img/10usd.png" }, //4
    { minDegree: 271, maxDegree: 330, value: "PlayStation 5 o IPhone", image: "/img/PlayoIphone.png" }, //3
    { minDegree: 331, maxDegree: 360, value: "5% de descuento para tu compra", image: "/img/5descuento.png" }, //2
  ];

  // Definir probabilidades en porcentaje para cada segmento
  const probabilities = [44, 5, 5, 2, 44, 0]; // Porcentajes asignados a cada segmento 2,1,6,5,4,3

  const data = [16, 16, 16, 16, 16, 16];
  const pieColors = ["#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da"];

  // Función para pre-cargar imágenes
  const preloadImages = () => {
    const images = [];
    let loadedCount = 0;

    imageSources.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        images[index] = img;
        loadedCount += 1;
        if (loadedCount === imageSources.length) {
          setImagesLoaded(true); // Marcar como cargadas cuando todas las imágenes estén listas
        }
      };
    });
    return images;
  };

  const initializeChart = (loadedImages) => {
    const ctx = wheelRef.current.getContext("2d");

    // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartInstance = new Chart(ctx, {
      plugins: [ChartDataLabels, {
        // Dibujar las imágenes en cada actualización
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          loadedImages.forEach((img, i) => {
            const meta = chart.getDatasetMeta(0).data[i];
            const { x, y } = meta.tooltipPosition(); // Obtiene la posición del centro del segmento
            const size = 70; // Tamaño de la imagen
            const halfSize = size / 2;

            ctx.save();
            ctx.drawImage(img, x - halfSize, y - halfSize, size, size);
            ctx.restore();
          });
        },
      }],
      type: "pie",
      data: {
        labels: imageSources, // Usamos las rutas de las imágenes como etiquetas
        datasets: [
          {
            backgroundColor: pieColors,
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: {
            display: false,
          },
          datalabels: {
            display: false, // Ocultamos los textos
          },
        },
        interaction: {
          mode: "none", // Desactiva la interacción al pasar el mouse
        },
        hover: {
          mode: null, // Desactiva el cambio de color en hover
        },
      },
    });

    // Almacenar la instancia del gráfico en la referencia
    chartInstanceRef.current = chartInstance;

    // Forzar redibujado inmediatamente después de inicializar
    setTimeout(() => {
      chartInstance.update();
    }, 100); // Espera un poco para asegurarte de que el gráfico se actualiza correctamente
  };

  // Generar un número aleatorio basado en las probabilidades
  const getRandomSegmentByProbability = () => {
    const random = Math.random() * 100; // Genera un número entre 0 y 100
    let cumulativeProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random <= cumulativeProbability) {
        return i; // Retorna el índice del segmento seleccionado
      }
    }
  };

  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        setFinalValue(`${i.value}`);
        setIsSpinning(false);
        setHasSpun(true); // Desactivar la ruleta después del giro

        // Lanza confeti cuando se obtiene el premio
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Reproducir el sonido de victoria
        winSoundRef.current.play();

        // Notificar el premio ganado a través de la función prop onPremioGanado
        onPremioGanado(i.value, i.image);

        break;
      }
    }
  };

  const spinWheel = () => {
    if (isSpinning || hasSpun) return; // No permite girar si ya giró
    setIsSpinning(true);
    setFinalValue("¡Buena Suerte!");
    
    audioRef.current.play(); // Reproducir el sonido de giro

    const selectedSegmentIndex = getRandomSegmentByProbability(); // Seleccionar segmento basado en la probabilidad
    const selectedSegment = rotationValues[selectedSegmentIndex];

    let randomDegree = Math.floor(Math.random() * (selectedSegment.maxDegree - selectedSegment.minDegree + 1) + selectedSegment.minDegree);
    let count = 0;
    let resultValue = 101;

    const rotationInterval = setInterval(() => {
      chartInstanceRef.current.options.rotation += resultValue;
      chartInstanceRef.current.update();

      if (chartInstanceRef.current.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        chartInstanceRef.current.options.rotation = 0;
      } else if (count > 15 && chartInstanceRef.current.options.rotation === randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;

        audioRef.current.pause(); // Detener el audio cuando termina el giro
        audioRef.current.currentTime = 0; // Reiniciar el audio
      }
    }, 10);
  };

  useEffect(() => {
    const loadedImages = preloadImages(); // Pre-cargar imágenes
    initializeChart(loadedImages); // Inicializa el gráfico una vez que las imágenes estén cargadas
  }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <canvas id="wheel" ref={wheelRef}></canvas>
        <button id="spin-btn" onClick={spinWheel} disabled={isSpinning || hasSpun}>
          Girar
        </button>
        <img src="/img/ruleta.svg" alt="spinner-arrow" />
      </div>
      <div id="final-value">
        <p>{finalValue}</p>
      </div>
    </div>
  );
};

export default Wheel;
