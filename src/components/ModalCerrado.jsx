// components/ModalCerrado.jsx
import { useState, useEffect } from "react";
import logotipo from "../img/Logotipo.jpg";

const ModalCerrado = ({ onContinuar }) => {
  const [mostrar, setMostrar] = useState(false);

   const estaAbierto = () => {
    const ahora = new Date();

    // Ajustamos hora de Venezuela (UTC-4)
    const utcHour = ahora.getUTCHours();
    const utcMinutes = ahora.getUTCMinutes();
    const horaVenezuela = (utcHour - 4 + 24) % 24; // modulo 24 por si da negativo
    const minutosVenezuela = utcMinutes;

    const diaSemana = ahora.getUTCDay(); // 0=domingo, 1=lunes, 2=martes, etc.

    if (diaSemana === 2) return false; // martes cerrado

    const horaActual = horaVenezuela + minutosVenezuela / 60;

    const apertura = 12; // 12:00
    const cierre = 23.5; // 23:30

    return horaActual >= apertura && horaActual <= cierre;
  };

  useEffect(() => {
    const modalVisto = sessionStorage.getItem("modalCerradoVisto");
    if (modalVisto === "true") return;

    if (!estaAbierto()) {  // <-- mostramos el modal solo si NO está abierto
      setMostrar(true);
      sessionStorage.setItem("modalCerradoVisto", "true");
    }
  }, []);

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4 ">
        <div className="bg-white/70 backdrop-blur-md shadow-2xl max-w-sm w-full h-[500px] flex flex-col justify-between p-6 animate-fadeIn">
      
      {/* LOGO ARRIBA */}
      <div className="flex justify-center mt-4">
        <img
          src={logotipo}
          alt="Logo"
          className="w-24 h-24 object-cover rounded-full shadow-md"
        />
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="text-center px-2">
        <h2 className="text-2xl font-extrabold text-orange-600 mb-3">
          ⏰ Lo sentimos, estamos cerrados
        </h2>
        <p className="text-gray-700 text-base mb-4">
          Nuestro restaurante cierra a las 23:00. Pero puedes ver nuestro menú y planificar tu pedido para mañana. 🍣
        </p>
      </div>

      {/* BOTON ABAJO */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setMostrar(false);
            onContinuar?.();
          }}
          className="bg-gradient-to-r rounded-md from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white px-10 py-2 font-semibold transition-all shadow-md"
        >
          Ver menú
        </button>
      </div>

    </div>
    </div>
  );
};

export default ModalCerrado;
