import { useState,useEffect } from "react";
import Select from "react-select";
import { Plus, Minus, Trash2, Info } from "lucide-react";
import {entradas} from "./Utils/DescripcionesPlatos";
import { nanoid } from "nanoid";
import  { customStyles, ModalAnimado, } from "./Utils/CustomStyles";
import { showSuccess, showError } from "./Utils/toastUtils";
import { useItems } from "../Hooks/useItems";



const opcionesPlatos = Object.keys(entradas).map((item) => ({
  label: item,
  value: item,
}));


const PlatoSelectorEntradas = ({ onSeleccion }) => {
   
  const [ingredientesSeleccionadosPorEntrada, setIngredientesSeleccionadosPorEntrada] = useState(() => {
  try {
    const stored = sessionStorage.getItem("ingredientesSeleccionadosPorEntrada");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
  });
  const [modalDescripcionInfo, setModalDescripcionInfo] = useState(null);
  const [tempuraFrioPorSabor, setTempuraFrioPorSabor] = useState({});
  const [platoTemporal, setPlatoTemporal] = useState(null);
  const [platoPendiente, setPlatoPendiente] = useState(null); // plato seleccionado del Select, aún no confirmado
const { platosSeleccionados, setPlatosSeleccionados, aumentarCantidad, disminuirCantidad, eliminarItem } = useItems("entradasSeleccionadas");

  


  useEffect(() => {
  try {
    const arrayEntradas = platosSeleccionados.map((plato) => ({
      id: plato.id,
      nombre: plato.nombre,
      cantidad: plato.cantidad,
      precio: plato.precio, // asegúrate que ya esté definido correctamente en el plato
      ingredientes: (ingredientesSeleccionadosPorEntrada[plato.id] || []).map((nombreIngrediente) => ({
        nombre: nombreIngrediente,
        tempuraFrio: tempuraFrioPorSabor[plato.id]?.[nombreIngrediente] || null,
      })),
    }));

    sessionStorage.setItem("entradasSeleccionadas", JSON.stringify(arrayEntradas));

    onSeleccion(platosSeleccionados);
  } catch (e) {
    console.error("Error guardando entradasSeleccionadas en sessionStorage", e);
  }
  }, [platosSeleccionados, ingredientesSeleccionadosPorEntrada, tempuraFrioPorSabor, onSeleccion]);

  const validarSeleccionRoll = (platoId) => {
  const seleccion = ingredientesSeleccionadosPorEntrada[platoId] || [];

  const plato = platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;
  if (!plato) return false;

  const nombre = plato.nombre;

  if (nombre === "Oniguiris") {
    return seleccion.length >= 3 && !!seleccion[0] && !!seleccion[1];
  }

  if (nombre === "Naganos") {
    return seleccion.length === 2;
  }

  return true;
  };

  const agregarOActualizarPlato = (platoNombre) => {
  const precio = entradas[platoNombre]?.precio || "0";
  const nuevoId = nanoid();

  const nuevoPlato = {
    id: nuevoId,
    nombre: platoNombre,
    cantidad: 1,
    precio,
  };

  if (entradas[platoNombre]?.modal) {
    // solo preparar, NO agregar aún
    setIngredientesSeleccionadosPorEntrada((prev) => ({
      ...prev,
      [nuevoId]: [],
    }));
    setPlatoTemporal(nuevoPlato);
    setModalDescripcionInfo({ nombre: platoNombre, id: nuevoId });
  } else {
    // agregar directamente si no necesita modal
    setPlatosSeleccionados((prev) => [nuevoPlato, ...prev]);
    showSuccess(`${platoNombre} agregado`,);
  }
  };

  const toggleIngredienteSimple = (platoId, ingrediente) => {
  setIngredientesSeleccionadosPorEntrada((prev) => {
    const seleccionActual = Array.isArray(prev[platoId]) ? prev[platoId] : [];

    // Buscar nombre del plato desde entradasSeleccionadas o platoTemporal
    const plato =
      platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;
    const nombre = plato?.nombre || "";

    // Define maxSeleccion según nombre del plato
    const maxSeleccion = nombre === "Naganos" ? 2 : 3;

    const yaSeleccionado = seleccionActual.includes(ingrediente);

    let nuevaSeleccion;

    if (yaSeleccionado) {
      // Deseleccionar
      nuevaSeleccion = seleccionActual.filter((i) => i !== ingrediente);

      // Eliminar tempura/frío si aplica
      setTempuraFrioPorSabor((prevTempuraFrio) => {
        const copia = { ...prevTempuraFrio };
        if (copia[platoId]) {
          delete copia[platoId][ingrediente];
          if (Object.keys(copia[platoId]).length === 0) {
            delete copia[platoId];
          }
        }
        return copia;
      });
    } else {
      if (seleccionActual.length >= maxSeleccion) {
        // Reemplazar el primero seleccionado con el nuevo
        const ingredienteAEliminar = seleccionActual[0];
        nuevaSeleccion = [...seleccionActual.slice(1), ingrediente];

        // Eliminar tempura/frío si aplica
        setTempuraFrioPorSabor((prevTempuraFrio) => {
          const copia = { ...prevTempuraFrio };
          if (copia[platoId]) {
            delete copia[platoId][ingredienteAEliminar];
            if (Object.keys(copia[platoId]).length === 0) {
              delete copia[platoId];
            }
          }
          return copia;
        });
      } else {
        nuevaSeleccion = [...seleccionActual, ingrediente];
      }
    }

    return {
      ...prev,
      [platoId]: nuevaSeleccion,
    };
  });
  };

  const CheckListSimple = ({ ingredientes, platoId }) => {
  const seleccion = ingredientesSeleccionadosPorEntrada[platoId] || [];
  const plato =
    platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;
  const nombre = plato?.nombre || "";

  const tempuraFrioSabor = tempuraFrioPorSabor[platoId] || {};

  const handleToggleTempuraFrio = (sabor, valor) => {
    setTempuraFrioPorSabor((prev) => ({
      ...prev,
      [platoId]: {
        ...prev[platoId],
        [sabor]: valor,
      },
    }));
  };

  const esNagano = nombre.toLowerCase() === "naganos";

  return (
    <div className="flex flex-col gap-2">
      {ingredientes.map((ingrediente) => {
        const estaSeleccionado = seleccion.includes(ingrediente);
        const elegidoTempuraOFrio = tempuraFrioSabor[ingrediente];

        return (
          <div key={ingrediente} className="flex flex-col">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={estaSeleccionado}
                onChange={() => toggleIngredienteSimple(platoId, ingrediente)}
              />
              {ingrediente}
            </label>

            {!esNagano && estaSeleccionado && !elegidoTempuraOFrio && (
              <div className="ml-6 mt-1 flex space-x-4">
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() =>
                      handleToggleTempuraFrio(ingrediente, "tempura")
                    }
                  />
                  <span className="ml-2">Tempura</span>
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() =>
                      handleToggleTempuraFrio(ingrediente, "frio")
                    }
                  />
                  <span className="ml-2">Frío</span>
                </label>
              </div>
            )}

            {!esNagano && elegidoTempuraOFrio && (
              <p className="ml-6 mt-1 text-sm italic text-gray-600">
                Opción elegida:{" "}
                {elegidoTempuraOFrio.charAt(0).toUpperCase() +
                  elegidoTempuraOFrio.slice(1)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
  };

  const actualizarCheckbox = (nombre, campo, valor) => {
    setPlatosSeleccionados((prev) =>
      prev.map((p) => {
        if (p.nombre !== nombre) return p;

        // Si se selecciona un checkbox, se desactiva el otro
        const nuevoEstado = {
          ...p,
          tempura: campo === "tempura" ? valor : false,
          frio: campo === "frio" ? valor : false,
        };

        return nuevoEstado;
      })
    );
  };

  const cerrarModal = () => {
  if (!modalDescripcionInfo) return;

  const { nombre, id: platoId } = modalDescripcionInfo;

  // Validación para entradas especiales
  if (["Oniguiris", "Niguiris", "Miyazakis", "Naganos"].includes(nombre)) {
    const seleccion = ingredientesSeleccionadosPorEntrada[platoId] || [];
    const tempuraFrioSeleccion = tempuraFrioPorSabor[platoId] || {};

    // Validar que para todos los sabores haya Tempura o Frío (excepto Naganos)
    if (nombre !== "Naganos") {
      const algunoSinTempuraFrio = seleccion.some(
        (sabor) => !tempuraFrioSeleccion[sabor]
      );
      if (algunoSinTempuraFrio) {
        showError("Debes seleccionar Tempura o Frío para todos los sabores.");
        return;
      }
    }

    // Validar cantidad de sabores según plato
    if (!validarSeleccionRoll(platoId)) {
      if (["Oniguiris", "Niguiris", "Miyazakis"].includes(nombre)) {
        showError("Debes seleccionar 3 sabores.");
        return;
      }
      if (nombre === "Naganos") {
        showError("Debes seleccionar 2 sabores.");
        return;
      }
    }

    // Actualizar o agregar plato especial con ID existente
    setPlatosSeleccionados((prev) => {
  const existe = prev.find((p) => p.id === platoId);
  const precio = entradas[nombre]?.precio || "0"; // ✅ O donde tengas tu data de precios

  const nuevoPlato = {
    id: platoId,
    nombre,
    cantidad: 1,
    tempura: false,
    frio: false,
    precio, // ✅ Agregado aquí
  };

  if (existe) {
    return prev.map((p) => (p.id === platoId ? nuevoPlato : p));
  } else {
    return [nuevoPlato, ...prev];
  }
});


  showSuccess(`${nombre} agregado`,);
    
    // Limpiar estados y cerrar modal
    setModalDescripcionInfo(null);
    setPlatoPendiente(null);
    setPlatoTemporal(null);
    return;
  }

  // Para otros platos con modal (edición general)
  if (!platoTemporal) {
    // Si por alguna razón no hay plato temporal, cerrar sin cambios
    setModalDescripcionInfo(null);
    setPlatoPendiente(null);
    return;
  }

  setPlatosSeleccionados((prev) => {
    const existe = prev.find((p) => p.id === platoId);
    if (existe) {
      // Actualizar plato existente
      return prev.map((p) => (p.id === platoId ? platoTemporal : p));
    } else {
      // Agregar plato nuevo
      return [platoTemporal, ...prev];
    }
  });

  showSuccess(`${platoTemporal.nombre} agregado correctamente.`);

  // Limpiar estados y cerrar modal
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
      placeholder="Selecciona una Entrada"
      onChange={(opt) => agregarOActualizarPlato(opt.value, 1)}
      menuPlacement="auto"
      isSearchable={false}
    />

    <div className="space-y-4 mt-4">
      {platosSeleccionados.map((plato) => {
        const esOniguiris = plato.nombre === "Oniguiris";
        const esNaganos = plato.nombre === "Naganos";

        return (
          <div key={plato.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-gray-900 text-lg flex items-center justify-between sm:justify-start">
                {plato.nombre}
                <button
                onClick={() => {
                  setModalDescripcionInfo({ nombre: plato.nombre, id: plato.id });
                  setPlatoTemporal(plato); // ✅ Asegura que el modal tenga el contenido del plato actual
                }}
                className="ml-2 text-red-500 hover:text-red-700"
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
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">Cantidad: {plato.cantidad}</p>

            {(esOniguiris || esNaganos) && (
              <>
                <p className="mt-2 font-semibold text-red-600">Ingredientes:</p>
                <CheckListSimple
                  ingredientes={entradas[plato.nombre]?.ingredientes || []}
                  platoId={plato.id}
                />
              </>
            )}

            {esOniguiris && entradas[plato.nombre]?.permitirTempuraYFrio && (
              <div className="mt-4 space-x-4 flex justify-between">
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={plato.tempura || false}
                    onChange={() =>
                      actualizarCheckbox(plato.id, "tempura", !plato.tempura)
                    }
                    disabled={plato.frio}
                  />
                  <span className="ml-2">Tempura</span>
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={plato.frio || false}
                    onChange={() =>
                      actualizarCheckbox(plato.id, "frio", !plato.frio)
                    }
                    disabled={plato.tempura}
                  />
                  <span className="ml-2">Frío</span>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>



     <ModalAnimado
  isOpen={modalDescripcionInfo && entradas[modalDescripcionInfo?.nombre]?.modal === true}
  onClose={() => setModalDescripcionInfo(null)}
  
>
  {/* Botón de cerrar */}
  <button
    onClick={forzarCerrarModal}
    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
    aria-label="Cerrar"
  >
    ✕
  </button>

  {/* Título y piezas */}
  <h2 className="text-xl text-red-600 font-bold mb-2">
    {modalDescripcionInfo?.nombre}
  </h2>
  <p className="font-semibold text-red-600 mb-1">
    {entradas[modalDescripcionInfo?.nombre]?.piezas}
  </p>

  {/* Descripción */}
  {entradas[modalDescripcionInfo?.nombre]?.descripcion && (
    <p className="mb-3">{entradas[modalDescripcionInfo?.nombre]?.descripcion}</p>
  )}

  {/* Detalles Miyazakis */}
  {modalDescripcionInfo?.nombre === "Miyazakis" && (
    <div className="text-sm text-gray-700 space-y-2 mb-3">
      {entradas["Miyazakis"]?.piezasDetalles?.map((detalle, index) => (
        <p key={index}>
          <strong>Pieza {index + 1}:</strong> {detalle}
        </p>
      ))}
    </div>
  )}

  {/* CheckListSimple para Oniguiris, Hyogos ROLL, Naganos */}
  {["Oniguiris", "Hyogos ROLL", "Naganos"].includes(modalDescripcionInfo?.nombre) && (
    <>
      {(modalDescripcionInfo?.nombre === "Oniguiris" ||
        modalDescripcionInfo?.nombre === "Naganos") && (
        <p className="mb-2 text-gray-600 text-xs italic">
          Debes elegir{" "}
          <strong>
            {modalDescripcionInfo?.nombre === "Oniguiris" ? "3 sabores" : "2 sabores"}
          </strong>
          .
        </p>
      )}
      <CheckListSimple
        ingredientes={entradas[modalDescripcionInfo?.nombre]?.ingredientes}
        platoId={modalDescripcionInfo?.id}
      />
    </>
  )}

  {/* Detalles Naganos */}
  {modalDescripcionInfo?.nombre === "Naganos" && (
    <div className="text-sm text-gray-700 space-y-2 mb-3">
      {entradas["Naganos"]?.piezasDetalles?.map((detalle, index) => (
        <p key={index}>
          <strong>Pieza {index + 1}:</strong> {detalle}
        </p>
      ))}
    </div>
  )}

  {/* Topping y aderezo */}
  {entradas[modalDescripcionInfo?.nombre]?.topping && (
    <p className="mt-3 italic text-gray-700">
      Topping: {entradas[modalDescripcionInfo?.nombre]?.topping}
    </p>
  )}
  {entradas[modalDescripcionInfo?.nombre]?.aderezo && (
    <p className="mt-1 italic text-gray-700">
      {entradas[modalDescripcionInfo?.nombre]?.aderezo}
    </p>
  )}

  {/* Tempura y Frío para Oniguiris */}
  {modalDescripcionInfo?.nombre === "Oniguiris" &&
    entradas[modalDescripcionInfo?.nombre]?.permitirTempuraYFrio && (
      <div className="mt-3 flex flex-col gap-2">
        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={
              platosSeleccionados.find((p) => p.id === modalDescripcionInfo?.id)?.tempura || false
            }
            onChange={(e) =>
              actualizarCheckbox(modalDescripcionInfo?.id, "tempura", e.target.checked)
            }
            className="mr-2"
          />
          Tempura
        </label>
        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={
              platosSeleccionados.find((p) => p.id === modalDescripcionInfo?.id)?.frio || false
            }
            onChange={(e) =>
              actualizarCheckbox(modalDescripcionInfo?.id, "frio", e.target.checked)
            }
            className="mr-2"
          />
          Frío
        </label>
      </div>
    )}

  {/* Preparación */}
  <p className="mt-4 font-semibold text-red-600">
    {entradas[modalDescripcionInfo?.nombre]?.preparacion || " "}
  </p>

  {/* Botón OK */}
  <div className="mt-6 flex justify-end">
    <button
      onClick={cerrarModal}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      OK
    </button>
  </div>
</ModalAnimado>

  </div>
  );

};

export default PlatoSelectorEntradas;

