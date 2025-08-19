import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PlatoSelector from '../components/PlatoSelector';
import menu1 from '../img/menu1.png';
import menu2 from '../img/menu2.png';
import PlatoSelectorBarcos from '../components/PlatoSelectorBarcos';
import PlatoSelectorExtras from '../components/PlatoSelectorExtras';
import PlatoSelectorEntradas from '../components/PlatoSelectorEntradas';
import ModalInicio from '../components/ModalInicio';
import { PageModal } from '../components/Utils/CustomStyles';

const RealizarPedido = () => {
  const [seleccionEntradas, setSeleccionEntradas] = useState([]);
  const [seleccionRoles, setSeleccionRoles] = useState([]);
  const [seleccionBarcos, setSeleccionBarcos] = useState([]);
  const [seleccionExtras, setSeleccionExtras] = useState([]);
  const [croqueta, setCroqueta] = useState(false);
  const [ensalada, setEnsalada] = useState(false);
  const [interactivoBarcos, setInteractivoBarcos] = useState(false);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(-1);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const imagenes = [menu2, menu1];

  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const activo = () => {
    setInteractivoBarcos(true);
  };

  useEffect(() => {
  const modalVisto = sessionStorage.getItem("modalVisto");
  const origenModal = sessionStorage.getItem("origenModal");
  console.log("modalVisto:", modalVisto, "origenModal:", origenModal);

  if (modalVisto === "true" || origenModal === "promos") {
    console.log("Modal no se abre porque ya fue visto o viene de promos");
    return;
  }

  const timeout = setTimeout(() => {
    setModalOpen(true);
    sessionStorage.setItem("modalVisto", "true");  // <-- Guardamos que ya vimos el modal
    console.log("Abriendo modal después de 3 segundos");
  }, 3000);

  return () => clearTimeout(timeout);
}, []);




  const handleSiguiente = () => {
  const todosPlatos = [
    ...seleccionEntradas,
    ...seleccionRoles,
    ...seleccionBarcos,
    ...seleccionExtras,
  ];

  // Validar que todos los barcos tengan croqueta o ensalada
  const barcos = seleccionBarcos; // ya viene del hijo con toda la info
  const barcosSinAcompanante = barcos.filter(b => !b.croqueta && !b.ensalada);

  if (barcos.length > 0 && barcosSinAcompanante.length > 0) {
    toast.error(`Falta seleccionar Croqueta o Ensalada para todos los barcos.`, {
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
        <ModalInicio isOpen={modalOpen} onClose={() => setModalOpen(false)} />

        <div className="flex justify-center gap-4 mb-6 mt">
          <img
            src={menu2}
            alt="Menú 2"
            onClick={() => abrirModalImagen(0)}
            className="w-32 h-40 object-cover rounded-lg shadow-xl cursor-pointer transform rotate-[-3deg] border border-gray-300 hover:scale-105 transition"
          />
          <img
            src={menu1}
            alt="Menú 1"
            onClick={() => abrirModalImagen(1)}
            className="w-32 h-40 object-cover rounded-lg shadow-xl cursor-pointer transform rotate-[3deg] border border-gray-300 hover:scale-105 transition"
          />
        </div>

        <div className="flex flex-col items-center select-none cursor-default">
          <span className="text-red-400 font-medium text-sm">⬆️</span>
          <span className="text-red-600 font-bold text-sm">¡Pulsa para ver el menu!</span>
        </div>

        <h1 className="text-2xl font-bold text-red-600 mb-2">¡Más que un sushi! 🍣</h1>
        <p className="text-gray-600 mb-6 font-semibold">Personaliza tu pedido antes de continuar..</p>

        <p className="text-left text-red-600 font-semibold mb-1">Entradas</p>
        <PlatoSelectorEntradas onSeleccion={setSeleccionEntradas} valorSeleccionado={seleccionEntradas} />

        <p className="text-left text-red-600 font-semibold mb-1">Roles</p>
        <PlatoSelector onSeleccion={setSeleccionRoles} valorSeleccionado={seleccionRoles} />

        <p className="text-left text-red-600 font-semibold mb-1">Barcos/Tortas</p>
        <PlatoSelectorBarcos
          onSeleccion={setSeleccionBarcos}
          valorSeleccionado={seleccionBarcos}
          onInteractuar={activo}
        />

        <p className="text-left text-red-600 font-semibold mb-1">Extras</p>
        <PlatoSelectorExtras 
          onSeleccion={setSeleccionExtras} 
          valorSeleccionado={seleccionExtras}
          platosDisponibles={[...seleccionRoles, ...seleccionBarcos]} // ✅ Correcto
        />


        <button
          className="bg-gradient-to-r from-red-500 to-red-700 hover:bg-red-800 text-white px-10 py-2 mt-4 rounded transition mx-auto block"
          onClick={handleSiguiente}
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
