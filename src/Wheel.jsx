import React, { useRef, useState, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./wheel.css"; // Importa el archivo CSS

const Wheel = () => {
  const wheelRef = useRef(null); // Referencia al canvas
  const chartInstanceRef = useRef(null); // Referencia para almacenar la instancia del gráfico
  const [finalValue, setFinalValue] = useState("Apreta el boton girar para comenzar");
  const [isSpinning, setIsSpinning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Estado para saber si las imágenes se han cargado

  // Ruta de las imágenes que se mostrarán en cada segmento
  const imageSources = [
    "https://media.discordapp.net/attachments/1136473401800794133/1281430350869958757/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-deep-purple-220907-geo_inline.jpg.large-Photoroom.png-Photoroo.png?ex=66dbb083&is=66da5f03&hm=7801362d8c7d8124a40282a640844def065d6c6dbb2c57e971163f096b57ec86&=&format=webp&quality=lossless&width=479&height=670", // Imagen para el segmento 1
    "https://media.discordapp.net/attachments/1136473401800794133/1281429125630005260/descuento.png?ex=66dbaf5f&is=66da5ddf&hm=75be0c2740c5428e60075715470bd4a1bd63312251153d8c89b5f1fd0f08d3d5&=&format=webp&quality=lossless&width=261&height=261", // Imagen para el segmento 2
    "https://media.discordapp.net/attachments/1136473401800794133/1281429125281874013/calavera.png?ex=66dbaf5f&is=66da5ddf&hm=4978771507c2ccbd3e4ec85e7dd376a476792717e009b0ef4e3bc60c6ee3146e&=&format=webp&quality=lossless&width=261&height=261", // Imagen para el segmento 3
    "https://media.discordapp.net/attachments/1136473401800794133/1281429125013311539/objetomisterioso.png?ex=66dbaf5f&is=66da5ddf&hm=b5a8c54b36acd2b61e3fc332994d814a5bdbc450d851ba1d05eeea0cdf6a648c&=&format=webp&quality=lossless&width=261&height=261", // Imagen para el segmento 4
    "https://media.discordapp.net/attachments/1136473401800794133/1281429124803723334/airpods.png?ex=66dbaf5f&is=66da5ddf&hm=b4ddcf5233bb8473b632a42645660ad465c7a9153e842d575b962ddd3b8f25da&=&format=webp&quality=lossless&width=261&height=261", // Imagen para el segmento 5
    "https://media.discordapp.net/attachments/1136473401800794133/1281429124539219968/gabi.png?ex=66dbaf5f&is=66da5ddf&hm=b590d0a4e37066d016f6ad2e0ac63acf3e135c813e4cf9df5c2d93b5ed076a44&=&format=webp&quality=lossless&width=285&height=642", // Imagen para el segmento 6
  ];

  const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: "Un 10% de descuento para tu proxima compra" }, //2
    { minDegree: 31, maxDegree: 90, value: "Un iphone 4" }, //1
    { minDegree: 91, maxDegree: 150, value: "Un esclavo sexual" }, //6
    { minDegree: 151, maxDegree: 210, value: "Unos Airpods" }, //5
    { minDegree: 211, maxDegree: 270, value: "Un Producto misterioso" }, //4
    { minDegree: 271, maxDegree: 330, value: "Segui participando" }, //3
    { minDegree: 331, maxDegree: 360, value: "Un 10% de descuento para tu proxima compra"  }, //2
  ];

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
      plugins: [ChartDataLabels],
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
      plugins: [
        {
          // Dibujar las imágenes en cada actualización
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            loadedImages.forEach((img, i) => {
              const meta = chart.getDatasetMeta(0).data[i];
              const { x, y } = meta.tooltipPosition(); // Obtiene la posición del centro del segmento
              const size = 60; // Tamaño de la imagen
              const halfSize = size / 2;

              ctx.save();
              ctx.drawImage(img, x - halfSize, y - halfSize, size, size);
              ctx.restore();
            });
          },
        },
      ],
    });

    // Almacenar la instancia del gráfico en la referencia
    chartInstanceRef.current = chartInstance;

    // Forzar redibujado inmediatamente después de inicializar
    setTimeout(() => {
      chartInstance.update();
    }, 100); // Espera un poco para asegurarte de que el gráfico se actualiza correctamente
  };

  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        setFinalValue(`Ganaste: ${i.value}`);
        setIsSpinning(false);
        break;
      }
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setFinalValue("Buena Suerte!");

    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
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
        <button id="spin-btn" onClick={spinWheel} disabled={isSpinning}>
          Girar
        </button>
        <img src="https://media.discordapp.net/attachments/1136473401800794133/1281429979657277563/ruleta_1.png?ex=66dbb02a&is=66da5eaa&hm=967a4069e38c0610b235a34fdd8419b65348cb805e6bf1fa95a1c8b8a23a4cfa&=&format=webp&quality=lossless&width=48&height=48" alt="spinner-arrow" />
      </div>
      <div id="final-value">
        <p>{finalValue}</p>
      </div>
    </div>
  );
};

export default Wheel;
