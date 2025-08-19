import { useEffect, useState, useRef } from "react"; 
import Logotipo from "../img/Logotipo.png";
import ModalInicio from "./ModalInicio"; 
import { useLocation, useNavigate } from "react-router-dom";
import { PageModal } from "./Utils/CustomStyles";

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollY = useRef(0); // <-- ref en lugar de useState
  const [mostrarModal, setMostrarModal] = useState(false);


  

  const inicio = () => {
  setMostrarModal(true); // <-- Mostrar modal
  setTimeout(() => {
    setMostrarModal(false);
    navigate('/');
  }, 1000);
};


  // Al cerrar modal, guardamos que ya se vio
  const closeModal = () => {
    setModalOpen(false);
    sessionStorage.setItem("modalVisto", "true");
  };


  // Abrir modal solo con botón "Promos"
  const openModal = () => {
    sessionStorage.setItem("origenModal", "promos");
    setModalOpen(true);
  };

  // Mantenemos este efecto solo para bloquear abrir modal automático en rutas distintas
  useEffect(() => {
    // Si cambias de ruta y modal está abierto, lo cerramos
    if (modalOpen && location.pathname !== "/") {
      closeModal();
    }
    // No abrimos modal automáticamente aquí
  }, [location.pathname]); // Se ejecuta cuando cambia la ruta

  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current + 5) {
      setVisible(false);
    } else if (currentScrollY === 0) {
      setVisible(true);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between w-full">
          {/* LOGO */}
          <div
            className={`transition-all duration-500 pointer-events-auto ${
              visible ? "opacity-100" : "opacity-0"
            } p-2`}
          >
            <button onClick={() => inicio()}>
              <img

              src={Logotipo}
              alt="Logotipo"
              className="h-12 w-12 rounded-full shadow-lg object-cover"
            />
            </button>
            
          </div>

          {/* BOTÓN PROMOS */}
          <div
            className={`transition-all duration-500 pointer-events-auto ${
              visible ? "opacity-100" : "opacity-0"
            } p-2`}
          >
            <button
              onClick={openModal}
              className="relative text-red-500 text-lg px-6 py-2 font-semibold rounded-md overflow-hidden border-2 border-white tracking-widest shadow-lg hover:text-red-600 transition-all duration-300 animate-pulse"
              style={{
                fontFamily: "'Sawarabi Mincho', serif",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm animate-shine" />
              <span className="relative z-10">Promos</span>
            </button>
            <ModalInicio isOpen={modalOpen} onClose={closeModal} />
          </div>
        </div>
         <PageModal 
            mostrarModal={mostrarModal} 
            onComplete={() => setMostrarModal(false)} 
          />
      </nav>
    </>
  );
};

export default Navbar;
