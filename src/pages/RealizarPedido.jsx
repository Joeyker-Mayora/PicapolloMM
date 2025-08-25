import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import menu1 from '../img/menu1.jpg';
import PlatoSelectorExtras from '../components/PlatoSelectorExtras';
import ModalInicio from '../components/ModalInicio';
import { PageModal } from '../components/Utils/CustomStyles';
import PlatosCombosPequeños from '../components/PlatosCombosPequeños';
import PlatosCombosGrandes from '../components/PlatosCombosGrandes';
import PlatosVariedad from '../components/PlatosVariedad';
import { ChevronUp } from "lucide-react"
import ModalCerrado from '../components/ModalCerrado';

const RealizarPedido = () => {
  const [seleccionEntradas, setSeleccionEntradas] = useState([]);
  const [seleccionRoles, setSeleccionRoles] = useState([]);
  const [seleccionBarcos, setSeleccionBarcos] = useState([]);
  const [seleccionExtras, setSeleccionExtras] = useState([]);
  
  const [estaCerrado, setEstaCerrado] = useState(false);



  const [mostrarModal, setMostrarModal] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(-1);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const imagenes = [menu1];

  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

 


  const handleContinuarCerrado = () => {
    console.log("El usuario decidió continuar viendo el menú");
  };

  useEffect(() => {
  const modalVisto = sessionStorage.getItem("modalVisto");
  const origenModal = sessionStorage.getItem("origenModal");

  // Si ya se vio el modal o viene de promos, no abrir
  if (modalVisto === "true" || origenModal === "promos") return;

  // Si el restaurante está cerrado, no abrir el modal de promociones
  if (estaCerrado) {
    // Redirige directamente o solo muestra modal cerrado
    return;
  }

  const timeout = setTimeout(() => {
    setModalOpen(true);
    sessionStorage.setItem("modalVisto", "true");  // <-- Guardamos que ya vimos el modal
  }, 3000);

  return () => clearTimeout(timeout);
}, [estaCerrado]); // <-- agregamos dependencia para que reaccione si cambia





  const handleSiguiente = () => {
 if (estaCerrado) {
      toast.error("Lo sentimos, estamos cerrados. No puedes continuar ahora.", { icon: '⛔' });
      return;
    }


  const todosPlatos = [
    ...seleccionEntradas,
    ...seleccionRoles,
    ...seleccionBarcos,
    ...seleccionExtras,
  ];

  // Validar que todos los barcos tengan croqueta o ensalada

  

  if (todosPlatos.length === 0) {
    toast.error('Seleccioná al menos un plato', {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      style: {
        background: 'rgba(780, 38, 38, 0.85)',
        color: 'white',
        borderRadius: '12px',
        fontWeight: '600',
      },
    });
    return;
  }

  // Si todo está OK, continuar
  setMostrarModal(true);
  setTimeout(() => {
    setMostrarModal(false);
    window.scrollTo(0, 0);
    navigate('/form');
  }, 2000);
};


  const abrirModalImagen = (idx) => {
    setIndiceImagen(idx);
  };

  const cerrarModalImagen = () => {
    setIndiceImagen(-1);
  };

  const imagenAnterior = () => {
    setIndiceImagen((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const imagenSiguiente = () => {
    setIndiceImagen((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-h-screen flex items-start justify-center fondo px-6 py-2 sm:py-12 lg:py-4">
      <div className="bg-white p-8 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center relative mt-20 sm:mt-16">
          <ModalCerrado onContinuar={handleContinuarCerrado} />

        <ModalInicio isOpen={modalOpen} onClose={() => setModalOpen(false)} />

        <div className="flex justify-center gap-4 mb-6 mt">
          <img
            src={menu1}
            alt="Menú 1"
            onClick={() => abrirModalImagen(0)}
            className="w-32 h-40 object-cover rounded-lg shadow-xl cursor-pointer transform rotate-[3deg] border border-gray-300 hover:scale-105 transition"
          />
        </div>

        <div className="flex flex-col items-center select-none cursor-default">
          <ChevronUp className="text-orange-400 w-4 h-4" />
          <span className="text-orange-500 font-bold text-sm">¡Pulsa para ver el menu!</span>
        </div>

        <h1 className="text-2xl font-bold text-orange-600 mb-2">¡Pollo a la Broaster!🍗</h1>
        <p className="text-gray-600 mb-6 font-semibold">Personaliza tu pedido antes de continuar..</p>

       
        <p className="text-left text-orange-600 font-semibold mb-1">Combos Pequeños</p>
        <PlatosCombosPequeños onSeleccion={setSeleccionRoles} valorSeleccionado={seleccionRoles} />


        
        <p className="text-left text-orange-600 font-semibold mb-1">Combos Grandes</p>
        <PlatosCombosGrandes onSeleccion={setSeleccionBarcos} valorSeleccionado={seleccionBarcos} />

        

        <p className="text-left text-orange-600 font-semibold mb-1">Hamburguesas y mas</p>
        <PlatosVariedad onSeleccion={setSeleccionEntradas} valorSeleccionado={seleccionEntradas} />

        <p className="text-left text-orange-600 font-semibold mb-1">Extras</p>
        <PlatoSelectorExtras 
          onSeleccion={setSeleccionExtras} 
          valorSeleccionado={seleccionExtras}
          platosDisponibles={[...seleccionRoles, ...seleccionBarcos]} // ✅ Correcto
        />


        <button
          className={`px-10 py-2 mt-4 rounded transition mx-auto block ${
            estaCerrado
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-orange-700 hover:bg-orange-800 text-white"
          }`}
          onClick={handleSiguiente}
          disabled={estaCerrado}
        >
          SIGUIENTE
        </button>

        

        {indiceImagen >= 0 && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    onTouchStart={(e) => {
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      setTouchEndX(null);
    }}
    onTouchMove={(e) => {
      const touch = e.touches[0];
      setTouchEndX(touch.clientX);
    }}
    onTouchEnd={() => {
      if (touchStartX !== null && touchEndX !== null) {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        if (diff > threshold) {
          imagenSiguiente();
        } else if (diff < -threshold) {
          imagenAnterior();
        }
      }
      setTouchStartX(null);
      setTouchEndX(null);
    }}
  >
    {/* CONTENEDOR GENERAL */}
    <div className="relative w-full h-full flex items-center justify-center">
      {/* BOTÓN CERRAR (fijo) */}
      <button
        onClick={cerrarModalImagen}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full text-2xl z-50"
      >
        ✕
      </button>

      {/* FLECHAS (fijas) */}
      <button
        onClick={imagenAnterior}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 p-2 rounded-full text-3xl z-40"
      >
        ‹
      </button>
      <button
        onClick={imagenSiguiente}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 p-2 rounded-full text-3xl z-40"
      >
        ›
      </button>

      {/* IMAGEN (modo mobile fullscreen) */}
      <div className="sm:hidden w-full h-full flex items-center justify-center">
        <img
          src={imagenes[indiceImagen]}
          alt={`Menú ampliado ${indiceImagen}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* IMAGEN (modo escritorio) */}
      <div className="hidden sm:flex items-center justify-center max-w-[90vw] max-h-[90vh]">
        <img
          src={imagenes[indiceImagen]}
          alt={`Menú ampliado ${indiceImagen}`}
          className="rounded-lg max-w-full max-h-[80vh]"
        />
      </div>

      {/* INDICADORES (dots) */}
      <div className="absolute bottom-6 flex gap-2 justify-center z-50">
        {imagenes.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === indiceImagen ? 'bg-white' : 'bg-gray-500'
            }`}
          ></span>
        ))}
      </div>
    </div>
  </div>
)}

      </div>
      <PageModal 
      mostrarModal={mostrarModal} 
      onComplete={() => setMostrarModal(false)} 
    />
    </div>
  );
};

export default RealizarPedido;
