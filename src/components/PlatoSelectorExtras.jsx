import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Plus, Minus, Trash2, Info } from "lucide-react";
import Modal from "react-modal";
import { extras } from ".//Utils/DescripcionesPlatos";
import { nanoid } from "nanoid";
import { customStyles, ModalAnimado } from "./Utils/CustomStyles";
import { showSuccess, showError } from "./Utils/toastUtils";
import { useItems } from "../Hooks/useItems";


Modal.setAppElement("#root");

const opcionesPlatos = Object.keys(extras).map((nombre) => ({
  label: nombre,
  value: nombre,
}));

const PlatoSelectorExtras = ({ onSeleccion, platosDisponibles = [] }) => {
   
  const platosNotificados = useRef(new Set());
  const [modalPlato, setModalPlato] = useState(null);
  const [platoTemporal, setPlatoTemporal] = useState(null);
  const [abrirModalId, setAbrirModalId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const {platosSeleccionados, setPlatosSeleccionados, aumentarCantidad, disminuirCantidad, eliminarItem } = useItems("extrasSeleccionados");
  

  useEffect(() => {
    onSeleccion(platosSeleccionados);
    sessionStorage.setItem("extrasSeleccionados", JSON.stringify(platosSeleccionados));
  }, [platosSeleccionados, onSeleccion]);

  useEffect(() => {
  if (abrirModalId) {
    const existe = platosSeleccionados.some(p => p.id === abrirModalId);
    if (existe) {
      setModalPlato(abrirModalId);
      setAbrirModalId(null);
    }
  }
}, [platosSeleccionados, abrirModalId]);

  const agregarOActualizarPlato = (platoNombre) => {
    if (extras[platoNombre]?.modal && platosDisponibles.length === 0) {
      showError("Debes seleccionar al menos un plato para agregar este extra.");
      return;
  }

  const precio = extras[platoNombre]?.precio || "0";
  const nuevoId = nanoid();

  // Buscar si este plato pertenece a un barco o sushi torta
  let extraAplicado = "";

  for (const item of platosDisponibles) {
    if (item.platos && Array.isArray(item.platos)) {
      const encontrado = item.platos.find((pl) => pl.nombre === platoNombre);
      if (encontrado) {
        const tipo = item.tipo?.toLowerCase().includes("sushi") ? "Sushi Torta" : "Barco";
        extraAplicado = `${tipo} - ${item.tamaño} piezas`;
        break;
      }
    }
  }

  const nuevoPlatoTemporal = {
    id: nuevoId,
    nombre: platoNombre,
    cantidad: 1,
    relleno: false,
    topping: false,
    precio,
    extraAplicado, // ahora puede ser vacío o "Barco - 30 piezas", etc.
  };

  setPlatoTemporal(nuevoPlatoTemporal);

  if (extras[platoNombre]?.modal) {
    setModalPlato(nuevoId);
  } else {
    setPlatosSeleccionados((prev) => [...prev, nuevoPlatoTemporal]);

    if (!platosNotificados.current.has(nuevoId)) {
      showSuccess(`"${platoNombre}" agregado `);
      platosNotificados.current.add(nuevoId);
    }
  }
  };

  const cerrarModal = () => {
    if (!modalPlato || !platoTemporal) return;

    const { id, nombre, relleno, topping, extraAplicado } = platoTemporal;

    if (!relleno && !topping) {
      showError("Debes seleccionar al menos Relleno o Topping.");
      return;
    }

    if ((relleno || topping) && (!extraAplicado || extraAplicado === "")) {
      showError("Debes seleccionar dónde aplicar el relleno o topping.");
      return;
    }

    // 🔄 Reemplazar si ya existe, o agregar si es nuevo
    setPlatosSeleccionados((prev) => {
      const existe = prev.some((p) => p.id === id);
      return existe
        ? prev.map((p) => (p.id === id ? platoTemporal : p))
        : [...prev, platoTemporal];
    });

    if (!platosNotificados.current.has(id)) {
      showSuccess(`"${nombre}" agregado `);
      platosNotificados.current.add(id);
    }

    setModalPlato(null);
    setPlatoTemporal(null);
  };

  const actualizarCheckboxPlatoTemporal = (campo, valor) => {
    setPlatoTemporal((prev) => ({
      ...prev,
      relleno: campo === "relleno" ? valor : false,
      topping: campo === "topping" ? valor : false,
    }));
  };
  
  const actualizarCheckboxPlato = (id, campo, valor) => {
    setPlatosSeleccionados((prev) =>
      prev.map((plato) => {
        if (plato.id !== id) return plato;
        return {
          ...plato,
          relleno: campo === "relleno" ? valor : false,
          topping: campo === "topping" ? valor : false,
        };
      })
    );
  };

  const platoActual = platoTemporal;

  const handleSelect = (opt) => {
    if (!opt) return;
    agregarOActualizarPlato(opt.value);
    setSelectedOption(null); // Reinicia el Select
  };


  return (
    <div className="max-w-xl mx-auto mb-3"> {/* Agregué padding para móvil */}

      {/* Primer Select real React-Select */}
      <Select
        options={opcionesPlatos}
        styles={customStyles}
        placeholder="Selecciona un Extra"
        onChange={handleSelect}
        menuPlacement="top" // fuerza que siempre abra hacia arriba
        isSearchable={false}
      />

      <div className="space-y-4 mt-4">
        {platosSeleccionados.map((plato) => (
          <div key={plato.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-extrabold text-orange-600 text-lg flex items-center justify-between sm:justify-start">
                {plato.nombre}
                {extras[plato.nombre]?.modal && (
                  <button
                    onClick={() => {
                      const seleccionado = platosSeleccionados.find((p) => p.id === plato.id);
                      if (seleccionado) {
                        setPlatoTemporal({ ...seleccionado });
                        setModalPlato(plato.id);
                      }
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label={`Información de ${plato.nombre}`}
                  >
                    <Info size={18} />
                  </button>
                )}
              </h3>

              <div className="flex items-center justify-center space-x-2 mt-2 sm:mt-0">
                <button onClick={() => disminuirCantidad(plato.id, showSuccess)} className="p-1 text-gray-700 hover:text-black">
                  <Minus size={18} />
                </button>
                <button onClick={() => aumentarCantidad(plato.id, showSuccess)} className="p-1 text-gray-700 hover:text-black">
                  <Plus size={18} />
                </button>
                <button onClick={() => eliminarItem(plato.id, showSuccess)} className="p-1 text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">Cantidad: {plato.cantidad}</p>

            {extras[plato.nombre]?.modal && (
              <>
                <div className="mt-2 space-x-4 flex justify-between">
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={plato.relleno || false}
                      onChange={(e) =>
                        actualizarCheckboxPlato(plato.id, "relleno", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Relleno
                  </label>
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={plato.topping || false}
                      onChange={(e) =>
                        actualizarCheckboxPlato(plato.id, "topping", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Topping
                  </label>
                </div>

                {(plato.relleno || plato.topping) && (
                  <div className="mt-3">
                    <Select
                      options={platosDisponibles.map(pl => ({ value: pl.nombre, label: pl.nombre }))}
                      value={
                        plato.extraAplicado
                          ? { value: plato.extraAplicado, label: plato.extraAplicado }
                          : null
                      }
                      onChange={(selected) =>
                        actualizarCheckboxPlato(plato.id, "extraAplicado", selected ? selected.value : "")
                      }
                      placeholder="Seleccione un plato"
                      styles={customStyles}
                      menuPlacement="auto"
                      isSearchable={false}
                    />
                    
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
     <ModalAnimado
  isOpen={!!modalPlato}
  onClose={() => setModalPlato(null)}
  className="bg-white p-4 rounded-lg shadow-lg w-[78%] max-w-md mx-auto outline-none relative"
  overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
>
  {/* Botón de cerrar ✕ */}
  <button
    onClick={() => setModalPlato(null)}
    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
    aria-label="Cerrar modal"
  >
    ✕
  </button>

  {platoActual ? (
    <>
      <h2 className="text-2xl text-red-600 font-bold mb-4">{platoActual.nombre}</h2>

      {extras[platoActual.nombre]?.modal && (
        <div className="flex flex-col space-y-3 pt-4">
          {/* Checkbox Relleno */}
          <label className="inline-flex items-center text-md">
            <input
              type="checkbox"
              checked={platoTemporal?.relleno || false}
              onChange={(e) =>
                actualizarCheckboxPlatoTemporal("relleno", e.target.checked)
              }
              className="mr-3"
            />
            Relleno
          </label>

          {/* Checkbox Topping */}
          <label className="inline-flex items-center text-md">
            <input
              type="checkbox"
              checked={platoTemporal?.topping || false}
              onChange={(e) =>
                actualizarCheckboxPlatoTemporal("topping", e.target.checked)
              }
              className="mr-3"
            />
            Topping
          </label>

          {/* Select solo si hay relleno o topping */}
          {(platoTemporal?.relleno || platoTemporal?.topping) && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-600 text-xs italic">
                Seleccione dónde aplicar el{" "}
                <strong>{platoTemporal?.relleno ? "relleno" : "topping"}</strong>:
              </label>

              <Select
                options={[
                  ...platosDisponibles
                    .filter(pl => !pl.platos)
                    .map(pl => ({ value: pl.nombre, label: pl.nombre })),
                  ...platosDisponibles
                    .filter(pl => pl.platos)
                    .map(pl => {
                      const tipo = pl.tipo?.toLowerCase().includes("sushi") ? "Sushi Torta" : "Barco";
                      const nombre = `${tipo} - ${pl.tamaño} piezas`;
                      return { value: nombre, label: nombre };
                    })
                ]}
                value={
                  platoTemporal?.extraAplicado
                    ? { value: platoTemporal.extraAplicado, label: platoTemporal.extraAplicado }
                    : null
                }
                onChange={(selected) =>
                  setPlatoTemporal((prev) => ({
                    ...prev,
                    extraAplicado: selected ? selected.value : "",
                  }))
                }
                placeholder="Seleccione un plato"
                styles={customStyles}
                menuPlacement="auto"
                isSearchable={false}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={cerrarModal}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          OK
        </button>
      </div>
    </>
  ) : (
    <p>No se encontró el plato.</p>
  )}
</ModalAnimado>

    </div>
  );

};

export default PlatoSelectorExtras;
