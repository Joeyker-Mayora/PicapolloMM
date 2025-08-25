import { useState, useEffect} from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import {showError, showSuccess} from "./Utils/toastUtils"
import { modals } from "../components/Utils/DescripcionesPlatos"


const ModalInicio = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [isImageExpanded, setIsImageExpanded] = useState(null);
  const [mostrarModalPreparacion, setMostrarModalPreparacion] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalAgregarMas, setMostrarModalAgregarMas] = useState(false);
  const [promoSeleccionada, setPromoSeleccionada] = useState(null);
  const [preparacion, setPreparacion] = useState("");
  const [promosSeleccionadas, setPromosSeleccionadas] = useState([]);
  const [promoTemporal, setPromoTemporal] = useState(null); // para manejo interno
  const [mostrarPopover, setMostrarPopover] = useState(false);
  const [promoAnchor, setPromoAnchor] = useState(null); // botón anclado
  const [promoConSubopciones, setPromoConSubopciones] = useState(null);
  const [indexModalActual, setIndexModalActual] = useState(0);
  const [direccion, setDireccion] = useState(0); // 1 = siguiente, -1 = anterior
  const [interactuando, setInteractuando] = useState(false);
  const [primeraRotacion, setPrimeraRotacion] = useState(true);
  const [direccionUsuario, setDireccionUsuario] = useState(0); // -1 = atrás, 1 = adelante

    // Guardar en sessionStorage automáticamente cuando cambien las promos seleccionadas
  useEffect(() => {
    try {
      if (promosSeleccionadas.length > 0) {
        sessionStorage.setItem(
          "promosSeleccionadas",
          JSON.stringify(promosSeleccionadas)
        );
      }
    } catch (e) {
      console.error("Error guardando promos en sessionStorage:", e);
    }
  }, [promosSeleccionadas]);

  useEffect(() => {
    if (!interactuando) {
      const delay = primeraRotacion ? 6000 : 3000; // 6s primera vez, 3s después
      const timer = setTimeout(() => {
        setIndexModalActual(prev => (prev + 1) % modals.length);
        if (primeraRotacion) setPrimeraRotacion(false); // después de la primera
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [indexModalActual, interactuando, primeraRotacion]);

  
  const irSiguiente = () => { 
    setInteractuando(true);      // indicamos que es interacción del usuario
    setDireccionUsuario(1);      // avanzar → animación derecha a izquierda
    setIndexModalActual((prev) => (prev === modals.length - 1 ? 0 : prev + 1));
  };

  const irAnterior = () => {
    setInteractuando(true);
    setDireccionUsuario(-1);     // retroceder → animación izquierda a derecha
    setIndexModalActual((prev) => (prev === 0 ? modals.length - 1 : prev - 1));
  };

  const handlePromoClick = (promoPadre, promoHijo = null) => {
  const promoSeleccionada = promoHijo || promoPadre;

  const tienePreparacion =
    promoSeleccionada.opcionesPreparacion &&
    promoSeleccionada.opcionesPreparacion.length > 0;

  setPromoTemporal({
    ...promoSeleccionada,
    parentPromo: promoPadre,
    opcionesPreparacion: promoSeleccionada.opcionesPreparacion || []
  });

  if (tienePreparacion) {
    // Ir al modal de preparación
    setMostrarModalPreparacion(true);
  } else {
    // Guardar directo y abrir modal de agregar más
    const nuevaPromo = {
      id: nanoid(),
      nombre: promoSeleccionada.nombre,
      preparacion: null,
      precio: promoSeleccionada.precio,
      promo: { ...promoSeleccionada }
    };
    setPromosSeleccionadas(prev => [...prev, nuevaPromo]);
    setMostrarModalAgregarMas(true);
    showSuccess("Agregado");
  }
};



  const confirmarPreparacion = () => {
  if (!promoTemporal) return;

  const { nombre: nombrePromo, precio: precioPromo, opcionesPreparacion } = promoTemporal;

  if (!nombrePromo || !precioPromo) {
    toast.error("La promoción no está bien definida.");
    return;
  }

  // Validar solo si la promo requiere preparación
  if (opcionesPreparacion?.length > 0 && !preparacion) {
    showError("Por favor, elige una preparación");
    return;
  }

  showSuccess("Agregado");

  const nuevaPromo = {
    id: nanoid(),
    nombre: nombrePromo,
    preparacion: opcionesPreparacion?.length > 0 ? preparacion : null,
    precio: precioPromo,
    promo: { ...promoTemporal }
  };

  // Evitamos duplicar el nombre dentro de `promo`
  if (nuevaPromo.promo.nombre) delete nuevaPromo.promo.nombre;

  // Guardar en estado (sessionStorage lo maneja el useEffect)
  setPromosSeleccionadas(prev => [...prev, nuevaPromo]);

  // Limpiar estados y cerrar modales
  setPromoTemporal(null);
  setPreparacion("");
  setMostrarModalPreparacion(false);
  setMostrarModalAgregarMas(true);
};


  const volverAElegirPromo = () => {
    setPromoSeleccionada(null);
    setPreparacion("");
    setMostrarModalPreparacion(false);
  };

  return (
    <>
      {/* Modal principal animado */}

      <AnimatePresence>
        {isOpen && !mostrarModalPreparacion && !mostrarModalExito && !mostrarModalAgregarMas && !isImageExpanded && (
          <Modal
            isOpen
            onRequestClose={onClose}
            shouldFocusAfterRender={false}
            shouldCloseOnOverlayClick={true}
            contentLabel="Promoción"
            overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            className="border-none bg-transparent p-0 m-0 relative"
            
          >
            {/* Flechas y cerrar estáticos fuera del contenido */}
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="fixed top-4 right-4 text-gray-400 transition z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={() =>
                irAnterior()
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() =>
              irSiguiente()      
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {modals.map((_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${i === indexModalActual ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>



            {/* Contenido animado dentro del modal */}
            <motion.div
  key={modals[indexModalActual].nombre}
  initial={{
    x: interactuando
      ? direccionUsuario > 0
        ? "100vw"
        : "-100vw"
      : "100vw",
    opacity: 0,
  }}
  animate={{ x: 0, opacity: 1 }}
  exit={{
    x: interactuando
      ? direccionUsuario > 0
        ? "-100vw"
        : "100vw"
      : "-100vw",
    opacity: 0,
  }}
  transition={{ type: "tween", duration: 0.7 }}
  onMouseDown={() => setInteractuando(true)}
  onTouchStart={() => setInteractuando(true)}
  onDragStart={() => setInteractuando(true)}
  onKeyDown={() => setInteractuando(true)}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.3}
  onDragEnd={(event, info) => {
    const offset = info.offset.x;
    const threshold = 100;
    if (offset > threshold) {
      setDireccionUsuario(-1);
      irAnterior();
    } else if (offset < -threshold) {
      setDireccionUsuario(1);
      irSiguiente();
    }
  }}
  className="bg-white rounded-2xl shadow-2xl max-w-sm w-[90%] max-h-[90vh] overflow-hidden relative mx-auto"
>
  {/* Imagen con overlay y degradado */}
  <div
    className="relative w-full h-[35vh] sm:h-[250px] cursor-pointer overflow-hidden rounded-t-2xl"
    onClick={() => setIsImageExpanded(modals[indexModalActual].img)}
  >
    <img
      src={modals[indexModalActual].img}
      alt={modals[indexModalActual].nombre}
      className="object-cover w-full h-full select-none"
      draggable={false}
    />

    {/* Capa oscura encima */}
    <div className="absolute inset-0 bg-black/40" />

    {/* Degradado hacia blanco del modal */}
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent -mb-px" />

    {/* Texto/ícono centrado */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm font-semibold gap-1 select-none pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-4.553M19.553 5.447L15 1m4.553 4.447L21 5m-6 6v8a2 2 0 002 2h8a2 2 0 002-2v-8m-8 0h8"
        />
      </svg>
      <span>Pulsa para ampliar</span>
    </div>
  </div>

  {/* Botones de promos */}
  <div className="flex justify-center gap-3 px-6 py-4 relative">
    {modals[indexModalActual].botones.map((botonNombre, i) => {
      const promo = modals[indexModalActual].promos[i];

      return (
        <div key={i} className="relative">
          <button
            onClick={() => handlePromoClick(modals[indexModalActual], promo)}
            className="relative text-orange-500 text-sm px-4 py-1.5 font-semibold rounded-md overflow-hidden border-2 border-white tracking-widest shadow-lg hover:text-orange-600 transition-all duration-300"
            style={{ fontFamily: "'Sawarabi Mincho', serif" }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-sm animate-shine" />
            <span className="relative z-10">{botonNombre}</span>
          </button>
        </div>
      );
    })}
  </div>

  {/* Texto inferior */}
  <div className="px-6 pb-6 text-center">
    <h2 className="text-lg font-bold mb-1 text-orange-600">¡Promociones del Día! 🍗</h2>
    <p className="text-sm text-orange-400">
      Elige tu Promo favorita y completa los datos para tu pedido.
    </p>
  </div>
</motion.div>

          </Modal>
        )}
      </AnimatePresence>





      {/* Imagen ampliada con z-index alto */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setIsImageExpanded(null)}
        >
          <img src={isImageExpanded} alt="Imagen ampliada" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
        </div>
      )}


      {/* Modal Preparación con animación */}
      <AnimatePresence>
        {mostrarModalPreparacion && promoTemporal && (
          <motion.div
            key={`modal-preparacion-${promoTemporal.nombre}`}
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100vw", opacity: 0 }}
            transition={{ type: "tween", duration: 0.7 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]"
          >
            <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-xs text-orange outline-none">
              <h3 className="text-center text-lg font-bold mb-4">
                {`Elige el Acompañante🍗 `}
              </h3>

              <div className="flex flex-col gap-3 mb-5">
                {(promoTemporal.opcionesPreparacion || []).map((opcion) => (
                  <label
                    key={opcion}
                    className="flex items-center gap-3 cursor-pointer text-sm select-none"
                  >
                    <input
                      type="radio"
                      name={`preparacion-${promoTemporal.id || promoTemporal.nombre}`}
                      value={opcion}
                      checked={preparacion === opcion}
                      onChange={() => setPreparacion(opcion)}
                      className="accent-orange-600"
                    />
                    {opcion}
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={volverAElegirPromo}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 transition text-white font-semibold py-2 rounded"
                >
                  Volver
                </button>
                <button
                  onClick={confirmarPreparacion}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition text-white font-semibold py-2 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>







      {/* Modal Agregar Más con animación */}
      <AnimatePresence>
        {mostrarModalAgregarMas && (
          <motion.div
            key="modal-agregar"
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100vw", opacity: 0 }}
            transition={{ type: "tween", duration: 0.7 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]"
          >
            <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-xs text-orange">
              <h3 className="text-center text-lg font-bold mb-6">¿Deseás agregar algo más?</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMostrarModalAgregarMas(false);
                    onClose();
                  }}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 transition text-white font-semibold py-2 rounded"
                >
                  Sí
                </button>
                <button
                  onClick={() => {
                    sessionStorage.setItem('modalVisto', 'true');
                    setMostrarModalAgregarMas(false);
                    setMostrarModalExito(true);
                    setTimeout(() => {
                      setMostrarModalExito(false);
                      navigate("/form");
                    }, 2000);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition text-white font-semibold py-2 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

     {mostrarModalExito && (
  <div className="fixed inset-0 bg-white/100 backdrop-blur-sm flex items-center justify-center z-[80]">
    <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
      <div className="text-green-600 text-6xl mb-4">✔</div>
      <p className="text-green-700 font-semibold text-xl">¡Hecho!</p>
    </div>
  </div>
)}

    </>
  );



};

export default ModalInicio;
