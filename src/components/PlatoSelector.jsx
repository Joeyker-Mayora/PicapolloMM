import { useState,useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
import { Plus, Minus, Trash2, Info } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {descripcionesPlatos} from "./Utils/DescripcionesPlatos";
import { nanoid } from "nanoid";
import { customStyles, ModalAnimado } from "./Utils/CustomStyles";
import { showSuccess, showError } from "./Utils/toastUtils";
import { useItems } from "../Hooks/useItems";



const opcionesPlatos = Object.keys(descripcionesPlatos).map((item) => ({
  label: item,
  value: item,
}));


Modal.setAppElement("#root");

const PlatoSelector = ({ onSeleccion }) => {
  
  const [ingredientesSeleccionadosPorPlato, setIngredientesSeleccionadosPorPlato] = useState(() => {
  try {
    const stored = sessionStorage.getItem("ingredientesSeleccionadosPorPlato");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
  });
  const [modalDescripcionInfo, setModalDescripcionInfo] = useState(null);
  const [platoTemporal, setPlatoTemporal] = useState(null);
  const [platoPendiente, setPlatoPendiente] = useState(null); // plato seleccionado del Select, aún no confirmado
  const {platosSeleccionados, setPlatosSeleccionados, aumentarCantidad, disminuirCantidad, eliminarItem } = useItems("platosSeleccionados");
  
  

  useEffect(() => {
  try {
    sessionStorage.setItem("platosSeleccionados", JSON.stringify(platosSeleccionados));
    onSeleccion(platosSeleccionados)
  } catch (e) {
    console.error("Error guardando platosSeleccionados en localStorage", e);
  }
  }, [platosSeleccionados, onSeleccion]);

  useEffect(() => {
    try {
      sessionStorage.setItem("ingredientesSeleccionadosPorPlato", JSON.stringify(ingredientesSeleccionadosPorPlato));

    } catch (e) {
      console.error("Error guardando ingredientesSeleccionadosPorPlato en localStorage", e);
    }
  }, [ingredientesSeleccionadosPorPlato]);

  
  const validarSeleccionRoll = (platoId) => {
    const seleccion = ingredientesSeleccionadosPorPlato[platoId];
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
  const precio = descripcionesPlatos[platoNombre]?.precio || "0";
  const nuevoId = nanoid();

  // Inicializar ingredientes por id (nuevoId), no por nombre
  const nuevoIngrediente = ["Kawasakis ROLL", "Tohoku ROLL", "Hyogos ROLL"].includes(platoNombre)
    ? platoNombre === "Kawasakis ROLL"
      ? { proteinas: [], verduras: [] }
      : []
    : null;

  if (nuevoIngrediente !== null) {
    setIngredientesSeleccionadosPorPlato((prev) => ({
      ...prev,
      [nuevoId]: nuevoIngrediente
    }));
  }

  setPlatoTemporal({
    id: nuevoId,
    nombre: platoNombre,
    cantidad: 1,
    tempura: false,
    frio: false,
    precio,
  });

  setPlatoPendiente(platoNombre);
  setModalDescripcionInfo({
    nombre: platoNombre,
    id: nuevoId
  });
  };

  const actualizarCheckboxTemporal = (campo, valor) => {
    setPlatoTemporal((prev) => ({
      ...prev,
      tempura: campo === "tempura" ? valor : false,
      frio: campo === "frio" ? valor : false,
    }));
  };

  const toggleIngredienteSimple = (platoId, ingrediente) => {
    setIngredientesSeleccionadosPorPlato((prev) => {
      const seleccionActual = Array.isArray(prev[platoId]) ? prev[platoId] : [];

      const plato = platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;
      const nombre = plato?.nombre || "";

      // Define máximo según plato
      const maxSeleccion =
        nombre === "Tohoku ROLL" ? 1 :
        nombre === "Hyogos ROLL" ? 2 : 99;

      const yaSeleccionado = seleccionActual.includes(ingrediente);

      let nuevaSeleccion;

      if (yaSeleccionado) {
        // Deseleccionar
        nuevaSeleccion = seleccionActual.filter((i) => i !== ingrediente);
      } else {
        if (seleccionActual.length >= maxSeleccion) {
          // Reemplazar primero con nuevo para que solo estén max seleccionados
          nuevaSeleccion = [...seleccionActual.slice(1), ingrediente];
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
    const seleccion = ingredientesSeleccionadosPorPlato[platoId] || [];

    return (
      <div className="flex flex-col gap-2">
        {ingredientes.map((ingrediente) => {
          const estaSeleccionado = seleccion.includes(ingrediente);

          return (
            <label key={ingrediente} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={estaSeleccionado}
                onChange={() => toggleIngredienteSimple(platoId, ingrediente)}
              />
              {ingrediente}
            </label>
          );
        })}
      </div>
    );
  };

 const actualizarCheckbox = (id, campo, valor) => {
  setPlatosSeleccionados((prev) =>
    prev.map((p) => {
      if (p.id !== id) return p;

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

  const toggleIngrediente = (platoId, categoria, item) => {
  setIngredientesSeleccionadosPorPlato((prev) => {
    const seleccionActual = prev[platoId] || { proteinas: [], verduras: [] };
    const seleccionCategoria = seleccionActual[categoria] || [];

    // Obtén el plato para saber nombre y reglas
    const plato = platosSeleccionados.find((p) => p.id === platoId) || platoTemporal;
    const nombre = plato?.nombre || "";

    // Define máximo según plato y categoría
    let maxSeleccion = 99; // default sin límite
    if (nombre === "Kawasakis ROLL") {
      if (categoria === "proteinas") maxSeleccion = 2;
      else if (categoria === "verduras") maxSeleccion = 1; // si tienes esa regla
    } else if (nombre === "Tohoku ROLL") {
      maxSeleccion = 1;
    } else if (nombre === "Hyogos ROLL") {
      maxSeleccion = 1;
    }

    const estaSeleccionado = seleccionCategoria.includes(item);

    let nuevaSeleccion;

    if (estaSeleccionado) {
      // Deseleccionar
      nuevaSeleccion = seleccionCategoria.filter((i) => i !== item);
    } else {
      if (seleccionCategoria.length >= maxSeleccion) {
        // Reemplazar el primer seleccionado con el nuevo (para "cambiar" la selección)
        nuevaSeleccion = [...seleccionCategoria.slice(1), item];
      } else {
        // Agregar nuevo ingrediente
        nuevaSeleccion = [...seleccionCategoria, item];
      }
    }

    return {
      ...prev,
      [platoId]: {
        ...seleccionActual,
        [categoria]: nuevaSeleccion,
      },
    };
  });
  };

  const validarSeleccionIngredientes = (platoId) => {
    const seleccion = ingredientesSeleccionadosPorPlato[platoId] || {};
    const { proteinas = [], verduras = [] } = seleccion;

    return proteinas.length >= 2 && verduras.length >= 1;
  };
 

  const cerrarModal = () => {
    if (!modalDescripcionInfo || !platoTemporal) return;

    const nombre = modalDescripcionInfo.nombre;
    const platoId = modalDescripcionInfo.id; // ⚠️ Siempre usamos este id

    console.log("VALIDANDO:", nombre, "ID:", platoId, "SELECCION:", ingredientesSeleccionadosPorPlato[platoId]);

    if (nombre === "Kawasakis ROLL" && !validarSeleccionIngredientes(platoId)) {
      showError("Debes seleccionar al menos 2 proteínas y 1 verdura.");
      return;
    }

    if (["Tohoku ROLL", "Hyogos ROLL"].includes(nombre) && !validarSeleccionRoll(platoId)) {
      showError(
        nombre === "Tohoku ROLL"
          ? "Debes seleccionar un ingrediente."
          : "Debes seleccionar los dos ingredientes."
      );
      return;
    }

    const permitirChecks = descripcionesPlatos[nombre]?.permitirTempuraYFrio;
    if (permitirChecks && !platoTemporal.tempura && !platoTemporal.frio) {
      showError("Debes seleccionar Tempura o Frío.");
      return;
    }

    if (nombre === "Kawasakis ROLL") {
    showSuccess("ROLL agregado ");
  }

  if (["Tohoku ROLL", "Hyogos ROLL", "Tochigui ROLL"].includes(nombre)) {
    showSuccess("ROLL agregado ");
  }


    if (permitirChecks && (platoTemporal.tempura || platoTemporal.frio)) {
      showSuccess("ROLL agregado.");
    }

    setPlatosSeleccionados((prev) => {
      const existe = prev.find((p) => p.id === platoId);
      if (existe) {
        return prev.map((p) => (p.id === platoId ? platoTemporal : p));
      } else {
        return [platoTemporal, ...prev];
      }
    });

    setModalDescripcionInfo(null);
    setPlatoPendiente(null);
    setPlatoTemporal(null);
  };

  const forzarCerrarModal = () => {
    setModalDescripcionInfo(null);
  };

 const CheckList = ({ categorias, platoId }) => {
  const seleccion = ingredientesSeleccionadosPorPlato[platoId] || { proteinas: [], verduras: [] };

  return (
    <div className="flex flex-col gap-4">
      {categorias.map(({ categoria, items }) => (
        <div key={categoria}>
          <p className="mb-1 font-semibold text-red-600 capitalize">{categoria}:</p>
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const seleccionCategoria = seleccion[categoria] || [];
              const estaSeleccionado = seleccionCategoria.includes(item);

              return (
                <label key={item} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={estaSeleccionado}
                    onChange={() => toggleIngrediente(platoId, categoria, item)}
                  />
                  {item}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
  };


  return (
  <div className="max-w-xl mx-auto mb-3">
    <Select
      options={opcionesPlatos}
      styles={customStyles}
      placeholder="Selecciona un Roll"
      onChange={(opt) => agregarOActualizarPlato(opt.value)}
      menuPlacement="auto"
      isSearchable={false}
    />

    <div className="space-y-4 mt-4">
      {platosSeleccionados.map((plato) => {
        const mostrarChecks = descripcionesPlatos[plato.nombre]?.permitirTempuraYFrio;

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

            {plato.nombre === "Kawasakis ROLL" ? (
              <CheckList
                platoId={plato.id}
                categorias={[
                  {
                    categoria: "proteinas",
                    items: descripcionesPlatos[plato.nombre]?.ingredientes?.proteinas ?? [],
                  },
                  {
                    categoria: "verduras",
                    items: descripcionesPlatos[plato.nombre]?.ingredientes?.verduras ?? [],
                  },
                ]}
              />
            ) : plato.nombre === "Hyogos ROLL" || plato.nombre === "Tohoku ROLL" ? (
              <>
                <p className="mt-2 font-semibold text-red-600">Ingredientes:</p>
                <CheckListSimple
                  ingredientes={descripcionesPlatos[plato.nombre]?.ingredientes || []}
                  platoId={plato.id}
                />
              </>
            ) : mostrarChecks ? (
              <div className="mt-2 space-x-4 flex justify-between">
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={plato.tempura || false}
                    onChange={(e) =>
                      actualizarCheckbox(plato.id, "tempura", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Tempura
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={plato.frio || false}
                    onChange={(e) =>
                      actualizarCheckbox(plato.id, "frio", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Frío
                </label>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>

    <ModalAnimado
       isOpen={!!modalDescripcionInfo}
        onClose={cerrarModal}
    >
      <button
        onClick={forzarCerrarModal}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {modalDescripcionInfo && (
        <>
          <h2 className="text-xl text-red-600 font-bold mb-2">
            {modalDescripcionInfo.nombre}
          </h2>

          {descripcionesPlatos[modalDescripcionInfo.nombre]?.piezas && (
            <p className="font-semibold text-red-600 mb-1">
              {descripcionesPlatos[modalDescripcionInfo.nombre].piezas}
            </p>
          )}

          {descripcionesPlatos[modalDescripcionInfo.nombre]?.descripcion && (
            <p className="mb-3">
              {descripcionesPlatos[modalDescripcionInfo.nombre].descripcion}
            </p>
          )}

          {modalDescripcionInfo.nombre === "Kawasakis ROLL" && (
            <>
              <p className="mb-2 text-gray-600 text-xs italic">
                Debes elegir <strong>2 proteínas</strong> y <strong>1 verdura</strong>.
              </p>
              <CheckList
                platoId={modalDescripcionInfo.id}
                categorias={[
                  {
                    categoria: "proteinas",
                    items: descripcionesPlatos["Kawasakis ROLL"]?.ingredientes?.proteinas || [],
                  },
                  {
                    categoria: "verduras",
                    items: descripcionesPlatos["Kawasakis ROLL"]?.ingredientes?.verduras || [],
                  },
                ]}
              />
            </>
          )}

          {modalDescripcionInfo.nombre === "Hyogos ROLL" && (
            <>
              <p className="mb-2 text-gray-600 text-xs italic">
                Debes elegir <strong>2 sabores</strong>.
              </p>
              <CheckListSimple
                ingredientes={descripcionesPlatos["Hyogos ROLL"]?.ingredientes || []}
                platoId={modalDescripcionInfo.id}
              />
            </>
          )}

          {modalDescripcionInfo.nombre === "Tohoku ROLL" && (
            <>
              <p className="mb-2 text-gray-600 text-xs italic">
                Debes elegir <strong>1 sabor</strong>.
              </p>
              <CheckListSimple
                ingredientes={descripcionesPlatos["Tohoku ROLL"]?.ingredientes || []}
                platoId={modalDescripcionInfo.id}
              />
            </>
          )}

          {descripcionesPlatos[modalDescripcionInfo.nombre]?.topping && (
            <p className="mt-3 italic text-gray-700">
              Topping: {descripcionesPlatos[modalDescripcionInfo.nombre].topping}
            </p>
          )}
          {descripcionesPlatos[modalDescripcionInfo.nombre]?.aderezo && (
            <p className="mt-1 italic text-gray-700">
              Aderezo: {descripcionesPlatos[modalDescripcionInfo.nombre].aderezo}
            </p>
          )}

          {descripcionesPlatos[modalDescripcionInfo.nombre]?.permitirTempuraYFrio && (
            <div className="mt-3 flex flex-col gap-2">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={platoTemporal?.tempura || false}
                  onChange={(e) =>
                    actualizarCheckboxTemporal("tempura", e.target.checked)
                  }
                  className="mr-2"
                />
                Tempura
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={platoTemporal?.frio || false}
                  onChange={(e) =>
                    actualizarCheckboxTemporal("frio", e.target.checked)
                  }
                  className="mr-2"
                />
                Frío
              </label>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <p className="font-semibold text-red-600">
              {descripcionesPlatos[modalDescripcionInfo.nombre]?.preparacion ||
                "Preparación no especificada"}
            </p>
            <button
              onClick={cerrarModal}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>

        </>
      )}
    </ModalAnimado>
  </div>
  );


};

export default PlatoSelector;