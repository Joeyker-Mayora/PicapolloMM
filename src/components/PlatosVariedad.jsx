import { useState,useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
import { Plus, Minus, Trash2, Info } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {hamburguesasYMas} from "./Utils/DescripcionesPlatos";
import { nanoid } from "nanoid";
import { customStyles, ModalAnimado } from "./Utils/CustomStyles";
import { showSuccess, showError } from "./Utils/toastUtils";
import { useItems } from "../Hooks/useItems";

const opcionsPorcion = [
  { label: "6 Piezas", value: "6", },
  { label: "12 Piezas", value: "12", },
];


const opcionesPlatos = Object.keys(hamburguesasYMas).map((item) => ({
  label: item,
  value: item,
}));


Modal.setAppElement("#root");

const PlatosVariedad = ({ onSeleccion }) => {
  
  const [bebidaPorPlato, setbebidaPorPlato] = useState(() => {
  try {
    const stoorange = sessionStorage.getItem("bebidaPorPlato");
    return stoorange ? JSON.parse(stoorange) : {};
  } catch {
    return {};
  }
  });
  const [modalDescripcionInfo, setModalDescripcionInfo] = useState(null);
  const [platoTemporal, setPlatoTemporal] = useState(null);
  const [platoPendiente, setPlatoPendiente] = useState(null); // plato seleccionado del Select, aún no confirmado
  const {platosSeleccionados, setPlatosSeleccionados, aumentarCantidad, disminuirCantidad, eliminarItem } = useItems("platosVariedad");
  const [bebidaSeleccionada, setBebidaSeleccionada] = useState(null);
    const [cantidadPorcion, setCantidadPorcion] = useState(6);



  

  useEffect(() => {
  try {
    sessionStorage.setItem("platosVariedad", JSON.stringify(platosSeleccionados));
    onSeleccion(platosSeleccionados)
  } catch (e) {
    console.error("Error guardando platosVariedad en localStorage", e);
  }
  }, [platosSeleccionados, onSeleccion]);

 
useEffect(() => {
    try {
      sessionStorage.setItem("bebidaPorPlato", JSON.stringify(bebidaPorPlato));

    } catch (e) {
      console.error("Error guardando bebidaPorPlato en localStorage", e);
    }
  }, [bebidaPorPlato]);
  
  const validarSeleccionRoll = (platoId) => {
    const seleccion = bebidaPorPlato[platoId];
    const plato = platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;

    if (!plato) return false;
    if (!Array.isArray(seleccion)) return false;

    const nombre = plato.nombre;

    if (nombre === "Tohoku ROLL") {
      return seleccion.length >= 1;
    }

    if (nombre === "Hyogos ROLL") {
      return seleccion.length >= 2;
    }

    return true;
  };

  const agregarOActualizarPlato = (platoNombre) => {
  const precio = hamburguesasYMas[platoNombre]?.precio || "0";
  const nuevoId = nanoid();

  // Inicializar ingorangeientes por id (nuevoId), no por nombre
  const nuevoIngorangeiente = ["Kawasakis ROLL", "Tohoku ROLL", "Hyogos ROLL"].includes(platoNombre)
    ? platoNombre === "Kawasakis ROLL"
      ? { proteinas: [], verduras: [] }
      : []
    : null;

  if (nuevoIngorangeiente !== null) {
    setbebidaPorPlato((prev) => ({
      ...prev,
      [nuevoId]: nuevoIngorangeiente
    }));
  }

  setPlatoTemporal({
    id: nuevoId,
    nombre: platoNombre,
    cantidad: 1,
    precio,
    bebida: bebidaSeleccionada || null, // <-- agregamos la bebida aquí

  });

  setPlatoPendiente(platoNombre);
  setModalDescripcionInfo({
    nombre: platoNombre,
    id: nuevoId
  });
  };


  const CheckBebida = ({ platoId }) => {
  const opciones = ["Pepsi 1L", "7Up 1L", "Cola 1L", "Naranja 1L", "Malta"];
  const seleccion = bebidaPorPlato[platoId]?.[0] || "";

 


  return (
    <div className="flex flex-col gap-2">
      {opciones.map((bebida) => (
        <label key={bebida} className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`bebida-${platoId}`}
            value={bebida}
            checked={seleccion === bebida}
            onChange={() =>
              setbebidaPorPlato((prev) => ({
                ...prev,
                [platoId]: [bebida],
              }))
            }
          />
          {bebida}
        </label>
      ))}
    </div>
  );
};




  const validarSeleccionIngorangeientes = (platoId) => {
    const seleccion = bebidaPorPlato[platoId] || {};
    const { proteinas = [], verduras = [] } = seleccion;

    return proteinas.length >= 2 && verduras.length >= 1;
  };
 

 const cerrarModal = () => {
  if (!modalDescripcionInfo || !platoTemporal) return;

  const nombre = modalDescripcionInfo.nombre;
  const platoId = modalDescripcionInfo.id; 
  const bebidaSeleccionada = bebidaPorPlato[platoId]?.[0] || null;

  console.log(
    "VALIDANDO:",
    nombre,
    "ID:",
    platoId,
    "SELECCION:",
    bebidaPorPlato[platoId]
  );

  // Validaciones de rolls
  if (nombre === "Kawasakis ROLL" && !validarSeleccionIngorangeientes(platoId)) {
    showError("Debes seleccionar al menos 2 proteínas y 1 verdura.");
    return;
  }

  if (["Tohoku ROLL", "Hyogos ROLL"].includes(nombre) && !validarSeleccionRoll(platoId)) {
    showError(
      nombre === "Tohoku ROLL"
        ? "Debes seleccionar un ingorangeiente."
        : "Debes seleccionar los dos ingorangeientes."
    );
    return;
  }

  // Validación Tempura / Frío y bebida
  const permitirChecks = hamburguesasYMas[nombre]?.permitirBebida;
  if (permitirChecks && !bebidaSeleccionada) {
    showError("Debes elegir una bebida.");
    return;
  }

  // Agregar o actualizar plato en el carrito con la bebida
  const platoConBebida = { ...platoTemporal, bebida: bebidaSeleccionada };

  setPlatosSeleccionados((prev) => {
    const existe = prev.find((p) => p.id === platoId);
    if (existe) {
      return prev.map((p) => (p.id === platoId ? platoConBebida : p));
    } else {
      return [platoConBebida, ...prev];
    }
  });

  showSuccess("Plato agregado");

  // Reset estados
  setModalDescripcionInfo(null);
  setPlatoPendiente(null);
  setPlatoTemporal(null);
};



  const forzarCerrarModal = () => {
    setModalDescripcionInfo(null);
  };




  return (
  <div className="max-w-xl mx-auto mb-3">
    <Select
      options={opcionesPlatos}
      styles={customStyles}
      placeholder="Selecciona un Plato"
      onChange={(opt) => agregarOActualizarPlato(opt.value)}
      menuPlacement="auto"
      isSearchable={false}
    />

    <div className="space-y-4 mt-4">
  {platosSeleccionados.map((plato) => {
    const mostrarChecks = hamburguesasYMas[plato.nombre]?.permitirBebida;

    return (
      <div key={plato.id} className="bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-extrabold text-orange-600 text-lg flex items-center justify-between sm:justify-start">
            {plato.nombre}
            <button
              onClick={() => {
                setModalDescripcionInfo({ nombre: plato.nombre, id: plato.id });
                setPlatoTemporal(plato);
              }}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <Info size={18} />
            </button>
          </h3>

          <div className="flex items-center justify-center space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => disminuirCantidad(plato.id, showSuccess)}
              className="p-1 text-gray-700 hover:text-black"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => aumentarCantidad(plato.id, showSuccess)}
              className="p-1 text-gray-700 hover:text-black"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => eliminarItem(plato.id, showSuccess)}
              className="p-1 text-red-600 hover:text-orange-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2">Cantidad: {plato.cantidad}</p>

        {mostrarChecks ? (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">
              Tu bebida elegida:
            </p>
            <label className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={!!plato.bebida}
                readOnly
                className="mr-2"
              />
              {plato.bebida || "No seleccionada"}
            </label>
          </div>
        ) : null}
      </div>
    );
  })}
</div>


   <ModalAnimado isOpen={!!modalDescripcionInfo} onClose={cerrarModal}>

  {modalDescripcionInfo && (() => {

    const nombre = modalDescripcionInfo.nombre;

    const platoId = modalDescripcionInfo.id;

    const data = hamburguesasYMas[nombre] || {};



   



    const basePrecio = (data.precio) || 0;



    const getPrecioAlitas = (cant) => (cant === 12 ? basePrecio * 2 : basePrecio);

    const precioActualNumero = nombre === "Alitas de pollo"

      ? getPrecioAlitas(cantidadPorcion)

      : basePrecio;



    const formatUSD = (v) => {

      const n = Number(String(v).replace(",", "."));

      return Number.isFinite(n) ? `$${n.toFixed(2)}` : `$${v}`;

    };



    // 🔸 Mantener platoTemporal sincronizado cuando cambia cantidad/precio

   



    return (

      <div className="relative p-4 sm:p-5">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">

          <h2 className="text-xl font-bold text-orange-600 leading-tight">

            {nombre}

          </h2>

          <button

            onClick={forzarCerrarModal}

            className="absolute right-3 -top-3 sm:-top-4 text-gray-400 hover:text-orange-600 text-2xl leading-none"

            aria-label="Cerrar"

          >

            ✕

          </button>

        </div>



        {/* Línea */}

        <div className="border-t border-gray-200 mt-3 mb-4" />



        {/* Info general */}

        <p className="text-sm font-semibold text-gray-900">

          {nombre === "Alitas de pollo"

            ? (cantidadPorcion === 12 ? "¡12 piezas de alita!" : "¡6 piezas de alita!")

            : data.piezas}

        </p>



        {data.descripcion && (

          <p className="text-xs text-gray-500 mt-2 leading-relaxed">

            {data.descripcion}

          </p>

        )}



        {/* Selector de cantidad (solo para Alitas) */}

        {nombre === "Alitas de pollo" && (

          <div className="mt-4">

            <label className="block text-xs font-semibold text-gray-700 mb-1">

              Cantidad:

            </label>

           <Select
              options={opcionsPorcion}
              value={opcionsPorcion.find(op => op.value === cantidadPorcion)}
              onChange={(opt) => {
                const nuevaCantidad = Number(opt.value);
                  setCantidadPorcion(nuevaCantidad);

                  if (platoTemporal) {
                    const precioBase = Number(hamburguesasYMas[platoTemporal.nombre].precio);
                    const precioFinal = nuevaCantidad === 12 ? precioBase * 2 : precioBase;

                    setPlatoTemporal(prev => ({
                      ...prev,
                      precio: precioFinal
                    }));
                  }

              }}
              styles={customStyles}
            />


          </div>

        )}



        {/* Línea */}

        <div className="border-t border-gray-200 mt-5 mb-4" />



        {/* Papas + Bebida según permitirBebida */}

        {data.preparacion && (

          <div className="flex items-center gap-2 text-orange-600 font-medium">

            <span>{data.permitirBebida ? "🍟 + 🥤" : "🍟"}</span>

            <span>{data.preparacion.trim()}</span>

          </div>

        )}



        {/* Selector de bebida (si aplica) */}

        {data.permitirBebida && (

          <div className="mt-3">

            <p className="text-xs text-gray-600 mb-2">

              Elige tu <strong>bebida</strong>:

            </p>

            <CheckBebida platoId={platoId} />

          </div>

        )}



        {/* Línea */}

        <div className="border-t border-gray-200 mt-5 mb-4" />



        {/* Footer con precio + botón */}

        <div className="flex justify-between items-center">

          <div className="text-lg font-semibold text-orange-600">

            {formatUSD(precioActualNumero)}

          </div>



          <button

            onClick={cerrarModal} // 👈 delegamos a cerrarModal

            className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"

          >

            Agregar

          </button>

        </div>

      </div>

    );

  })()}

</ModalAnimado>





  </div>
  );


};

export default PlatosVariedad;