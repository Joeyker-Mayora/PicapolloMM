import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {showError} from "../components/Utils/toastUtils"
import { PageModal } from "../components/Utils/CustomStyles";
import Picapollo from "../img/Picapollo.png"



const PedidoForm = () => {
  const [nombre, setNombre] = useState("");
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [sector, setSector] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [entrega, setEntrega] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tarifa, setTarifa] = useState(null);


   const [ready, setReady] = useState(false); // ← evita sobrescribir con vacíos
  const loadedFromStorage = useRef(false);

   useEffect(() => {
    const raw = sessionStorage.getItem("datosPedido");
    if (raw) {
      const d = JSON.parse(raw);
      if (d?.nombre) setNombre(d.nombre);
      if (d?.telefono) setTelefono(d.telefono);
      if (d?.comentarios) setComentarios(d.comentarios);
      if (d?.entrega) setEntrega(d.entrega);
      if (d?.zonaSeleccionada) {
        const [zona] = d.zonaSeleccionada.split(",");
        setZonaSeleccionada((zona || "").trim());
      }
      if (d?.direccion) setSector(d.direccion);
      if (d?.tarifaDelivery !== undefined && d?.tarifaDelivery !== null) {
        setTarifa(d.tarifaDelivery);
      }
      loadedFromStorage.current = true;
    }
    setReady(true);
  }, []);



  const navigate = useNavigate();

  const zonasConTarifa = {
    "Catia la mar": "3.00",
    "Maiquetia": "1.00",
    "Aeropuerto IAIM": "2.00",
    "Macuto": "2.00",
    "Caribe": "3.00",
    "Tanaguarena": "3.00",
    "Carlos Soublette": "1.00",
    "La Guaira": "2.00",
    "Urimare": "3.00",
    "Caraballeda": "3.00",

  };

  const zonasConTarifaGratis = {
    "Catia la mar": "0,00",
    "Maiquetia": "0,00",
    "Aeropuerto IAIM": "260,00",
    "Macuto": "0,00",
    "Caribe": "0,00",
    "Tanaguarena": "0,00",
    "Carlos Soublette": "0,00",
    "La Guaira": "0,00",
    "Urimare": "0,00",
    "Caraballeda": ",00",

  };

  const handleZonaChange = (selectedOption) => {
    const zona = selectedOption ? selectedOption.value : "";
    setZonaSeleccionada(zona);
    setTarifa(zonasConTarifa[zona] || null);
    setSector(""); // limpia el sector cada vez que cambia la zona
  };

  const handleSiguiente = () => {
    if (!nombre.trim() || !telefono.trim()) {
      showError("Por favor, completá todos los campos.");
      return;
    }

    if (!entrega) {
      showError("Por favor, elegí una forma de entrega.");
      return;
    }

    const telefonoLimpio = telefono.trim();
    const telefonoValido = /^(0412|0414|0424|0416|0426)\d{7}$/.test(telefonoLimpio);
    if (!telefonoValido) {
      showError("El teléfono debe tener 11 dígitos y comenzar con un código válido.");
      return;
    }

    if (entrega === "Delivery") {
      if (!zonaSeleccionada) {
        showError("Seleccioná tu zona de entrega.");
        return;
      }

      if (!sector.trim()) {
        showError("Por favor, escribí el sector.");
        return;
      }
    }

        const direccionFinal = 
        entrega === "Delivery"
          ? `${zonaSeleccionada}, ${sector.trim()}`
          : entrega === "Retiro"
            ? "Sector Cocoteros, Maiquetia"
            : ""; // En Local no necesita dirección

      const datosPedido = {
        nombre,
        telefono,
        comentarios,
        entrega, // guardamos tal cual lo eligió el usuario
        zonaSeleccionada: entrega === "Delivery" ? `${zonaSeleccionada}, ${sector.trim()}` : "", 
        direccion: direccionFinal,
        tarifaDelivery: entrega === "Delivery" && tarifa ? tarifa : 0,
      };

    sessionStorage.setItem("datosPedido", JSON.stringify(datosPedido));

    setMostrarModal(true);
    setTimeout(() => {
      setMostrarModal(false);
      window.scrollTo(0, 0);
      navigate("/resumen");
    }, 2000);
  };

  const opcionesZonas = Object.keys(zonasConTarifa).map((zona) => ({
    value: zona,
    label: zona,
  }));

  return (
  <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-h-screen flex items-start justify-center fondo px-6 py-2 sm:py-12 lg:py-4">
    <div className="bg-white p-8 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center relative mt-20 sm:mt-16">

      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <img
          src={Picapollo}
          alt="Logotipo PicaPollo"
          className="w-40 h-30 object-cover"
        />
      </div>

      <p className="text-gray-600 mb-6 font-semibold mt-2">
        Completá tus datos para hacer tu pedido.
      </p>

      {/* Forma de entrega primero */}
      <p className="text-orange-600 font-semibold mb-2">Formas de entrega</p>
      <div className="flex justify-center mb-6 gap-6">
        {["Delivery", "Retiro", "En Local"].map((metodo) => (
          <label
            key={metodo}
            className="flex items-center gap-2 cursor-pointer select-none text-gray-700"
          >
            <input
              type="radio"
              name="entrega"
              value={metodo}
              checked={entrega === metodo}
              onChange={() => setEntrega(metodo)}
              className="accent-orange-600"
            />
            {metodo}
          </label>
        ))}
      </div>

      {/* Nombre y teléfono (siempre visibles) */}
      <input
        type="text"
        placeholder="Nombre"
        className="mb-4 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        autoComplete="name"
      />

      <input
        type="tel"
        placeholder="Teléfono"
        className="mb-6 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
        autoComplete="tel"
        maxLength={11}
      />

      {/* Secciones condicionales según la forma de entrega */}
      {entrega === "Delivery" && (
        <>
          {/* Zona */}
          <div className="mb-4 w-full shadow-md">
            <Select
              options={opcionesZonas}
              value={zonaSeleccionada ? { value: zonaSeleccionada, label: zonaSeleccionada } : null}
              onChange={handleZonaChange}
              placeholder="Seleccioná tu zona"
              isClearable
              styles={{
                control: (base) => ({ ...base, borderColor: "#e5e7eb", boxShadow: "none", minHeight: "44px", paddingLeft: "4px", fontSize: "1rem" }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Sector */}
          {zonaSeleccionada && (
            <input
              type="text"
              placeholder="Escribí el sector"
              className="mb-4 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          )}

          {/* Tarifa */}
          {tarifa !== null && (
           <div className="flex justify-between items-center mb-6 p-3 border border-orange-300 rounded shadow-md bg-orange-50 text-orange-600 text-sm font-semibold">
              <span>Tarifa de delivery</span>
              <span>${tarifa}</span>
            </div>
          )}
        </>
      )}

      {entrega === "Retiro" && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 font-semibold">
          Sector Cocoteros, Maiquetia.
        </div>
      )}

      {/* Para "En Local" no mostramos nada extra, solo nombre y teléfono */}

      {/* Comentarios */}
      <textarea
        placeholder="¿Hay algo que no quieres incluir en tu pedido? ¡Dejalo acá!"
        className="mb-4 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none"
        value={comentarios}
        onChange={(e) => setComentarios(e.target.value)}
      />

      <button
        onClick={handleSiguiente}
        className="bg-gradient-to-r from-orange-500 to-orange-700 hover:bg-orange-800 text-white px-10 py-2 mt-4 rounded transition mx-auto block"
      >
        SIGUIENTE
      </button>

    </div>

    <PageModal mostrarModal={mostrarModal} onComplete={() => setMostrarModal(false)} />
  </div>
);

};

export default PedidoForm;
