import { useRef, useState,useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
import { Trash2, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import {descripcionesPlatos} from "./Utils/DescripcionesPlatos";
import { nanoid } from "nanoid";
import { customStyles, ModalAnimado } from "./Utils/CustomStyles";

const opcionesIniciales = [
  { label: "30 piezas", value: "30", precio: "5120,00", tamaño: "30" },
  { label: "40 piezas", value: "40", precio: "6720,00", tamaño: "40" },
  { label: "Sushi Torta", value: "sushi-torta", precio: "7200,00", tamaño: "40" },
];


const opcionesPlatosFiltrados = Object.keys(descripcionesPlatos)
  .filter(
    (nombre) =>
      !["Kawasakis ROLL", "Tohoku ROLL", "Osaka ROLL", "hyogos Roll","Shibuya ROLL"].includes(nombre) &&
      (descripcionesPlatos[nombre].permitirTempuraYFrio || descripcionesPlatos[nombre].soloFrio)
  )
  .map((item) => ({ label: item, value: item }));

Modal.setAppElement("#root");

const PlatoSelectorBarcos = ({ onSeleccion, onInteractuar }) => {
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [modalDescripcionInfo, setModalDescripcionInfo] = useState(null);
  const [mostrarSegundoSelect, setMostrarSegundoSelect] = useState(false);
  const [mostrarModalInicial, setMostrarModalInicial] = useState(false);
  const [opcionInicialSeleccionada, setOpcionInicialSeleccionada] = useState(null);
  const [selectsAbiertos, setSelectsAbiertos] = useState(0);
  const [barcosSeleccionados, setBarcosSeleccionados] = useState([]); 
  const [barcoActivoId, setBarcoActivoId] = useState(null);
  const [toastMostrado, setToastMostrado] = useState(false);
  const [toastMostradoRoll, setToastMostradoRoll] = useState({
    "Tohoku ROLL": false,
    "Hyogos ROLL": false,
  });
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toastMostradoRef = useRef(false);

  const cantidadPlatos = opcionInicialSeleccionada === "40" ? 4 : 3;


  useEffect(() => {
  try {
    sessionStorage.setItem("pedidoBarco", JSON.stringify(platosSeleccionados));
    onSeleccion(platosSeleccionados)
  } catch (e) {
    console.error("Error guardando platosSeleccionados en localStorage", e);
  }
  }, [platosSeleccionados, onSeleccion]);

  useEffect(() => {
    try {
      const resumen = {
        barcos: barcosSeleccionados.map((barco) => {
          return {
            id: barco.id,
            tipo: barco.tipo, // ya tiene el label desde opcionesIniciales
            tamaño: barco.tamaño,
            precio: barco.precio,
            croqueta: barco.croqueta,
            ensalada: barco.ensalada,
            platos: barco.platos.map((plato) => ({
              id: plato.id,
              nombre: plato.nombre,
              cantidad: plato.cantidad,
              tempura: plato.tempura,
              frio: plato.frio,
            })),
          };
        }),
      };

      sessionStorage.setItem("pedidoBarco", JSON.stringify(resumen));
      onSeleccion(barcosSeleccionados);
    } catch (e) {
      console.error("Error guardando en sessionStorage:", e);
    }
  }, [barcosSeleccionados, onSeleccion]);


  useEffect(() => {
    if (mostrarSegundoSelect) {
      setMenuAbierto(true);
    } else {
      setMenuAbierto(false);
    }
  }, [mostrarSegundoSelect]);

  useEffect(() => {
    const todosListos = barcosSeleccionados.every(b => b.croqueta || b.ensalada);
    onInteractuar(todosListos);
  }, [barcosSeleccionados]);


  const opcionesFiltradasRef = useRef(null);
  


  const agregarNuevoBarco = (value) => {
  // Validar el barco activo actual antes de agregar uno nuevo
  if (barcosSeleccionados.length > 0) {
    const ultimoBarco = barcosSeleccionados[barcosSeleccionados.length - 1];
    const maxPlatos = ultimoBarco.tamaño === "40" ? 4 : 3;

    // Verificamos si el último barco está completo:
    const platosCompletos = ultimoBarco.platos.length === maxPlatos;
    const acompananteSeleccionado = ultimoBarco.croqueta || ultimoBarco.ensalada;

    if (!platosCompletos || !acompananteSeleccionado) {
      // Mostrar mensaje de error (puedes cambiarlo por un estado para mostrar UI)
      toast.error("Debes completar todos los requerimientos del barco actual.",{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      return; // Salimos sin agregar otro barco
    }
  }

  // Si pasa la validación, agregamos nuevo barco:
  const opcionSeleccionada = opcionesIniciales.find(opt => opt.value === value);
  if (!opcionSeleccionada) return;

  const nuevoBarco = {
    id: nanoid(),
    tamaño: opcionSeleccionada.tamaño,
    tipo: opcionSeleccionada.label,
    precio: opcionSeleccionada.precio,
    platos: [],
    croqueta: false,
    ensalada: false,
  };

  setBarcosSeleccionados((prev) => [...prev, nuevoBarco]);
  setBarcoActivoId(nuevoBarco.id);

  setMostrarModalInicial(true);
};



  const agregarOActualizarPlato = (barcoId, platoNombre) => {
    setBarcosSeleccionados((prev) =>
      prev.map((barco) => {
        if (barco.id !== barcoId) return barco;

        if (barco.platos.find(p => p.nombre === platoNombre)) {
          if (!toastMostradoRef.current) {
            toast.error(`Ya elegiste el plato "${platoNombre}" en este barco.`,{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
            toastMostradoRef.current = true;
            setTimeout(() => {
              toastMostradoRef.current = false;
            }, 2000);
          }
          return barco; // Sale sin agregar plato
        }

        const cantidadMax = barco.tamaño === "40" ? 4 : 3;

        if (barco.platos.length >= cantidadMax) {
          if (!toastMostradoRef.current) {
            toast.error(`Solo puedes elegir ${cantidadMax} platos.`,{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
            toastMostradoRef.current = true;
            setTimeout(() => {
              toastMostradoRef.current = false;
            }, 2000);
          }
          return barco;
        }

        const nuevoId = nanoid();

        const nuevoPlato = {
          id: nuevoId,
          nombre: platoNombre,
          cantidad: 1,
          tempura: false,
          frio: false,
        };

        setModalDescripcionInfo({ idPlato: nuevoId, nombre: platoNombre });
        setBarcoActivoId(barcoId);

        return {
          ...barco,
          platos: [...barco.platos, nuevoPlato],
        };
      })
    );
  };

  const validarPreparacion = () => {
    const barco = barcosSeleccionados.find(b => b.id === barcoActivoId);
    if (!barco) {
      toast.error("No se encontró el barco seleccionado.",{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      return false;
    }

    const plato = barco.platos.find(p => p.id === modalDescripcionInfo?.idPlato);
    if (!plato) {
      toast.error("No se encontró el plato seleccionado.",{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
    }

    if (!plato.tempura && !plato.frio) {
      toast.error("Debes elegir Tempura o Frío antes de continuar.",{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      return false;
    }

    toast.success(`¡Opción agregada correctamente!`, {
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  style: {
    background: 'rgba(22, 163, 74, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
    return true;
  };

  const handleModalOk = () => {
  setMostrarSegundoSelect(true); // 👈 aquí sí se abre la vista principal
  setSelectsAbiertos(1);
  setTimeout(() => {
    opcionesFiltradasRef.current?.focus();
  }, 100);
};


  const cerrarModal = () => {
    // Validación para Kawasakis ROLL

    // Validación para otros platos con permitirTempuraYFrio
    const plato = platosSeleccionados.find(p => p.nombre === modalDescripcionInfo);
    const permitirChecks = descripcionesPlatos[modalDescripcionInfo]?.permitirTempuraYFrio;

    if (
      permitirChecks &&
      plato &&
      !plato.tempura &&
      !plato.frio
    ) {
      toast.error("Debes seleccionar Tempura o Frío.",{
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="white"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  style: {
    background: 'rgba(780, 38, 38, 0.85)', // rojo con opacidad
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      return;
    }

    // Éxito para Kawasakis ROLL
    if (modalDescripcionInfo === "Kawasakis ROLL" && !toastMostrado) {
      toast.success("Ingredientes seleccionados correctamente.", {
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  style: {
    background: 'rgba(22, 163, 74, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      setToastMostrado(true);
    }

    // Éxito para Hyogos y Tohoku
    if (["Tohoku ROLL", "Hyogos ROLL"].includes(modalDescripcionInfo) && !toastMostradoRoll[modalDescripcionInfo]) {
      toast.success("Ingredientes seleccionados correctamente.", {
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  style: {
    background: 'rgba(22, 163, 74, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
      setToastMostradoRoll((prev) => ({ ...prev, [modalDescripcionInfo]: true }));
    }

    // Éxito para los demás con tempura/frio
    if (
      permitirChecks &&
      plato &&
      (plato.tempura || plato.frio)
    ) {
      toast.success("Opción seleccionada correctamente.", {
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  style: {
    background: 'rgba(22, 163, 74, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
  },
});
    }

    // Agregar plato si aún no fue agregado (solo aquí)
    if (!platosSeleccionados.some((p) => p.nombre === modalDescripcionInfo)) {
      const nuevoPlato = {
        nombre: modalDescripcionInfo,
        cantidad: 1,
        tempura: false,
        frio: false,
      };
      setPlatosSeleccionados((prev) => [...prev, nuevoPlato]);
    }

    setModalDescripcionInfo(null);

    

    if (platosSeleccionados.length < cantidadPlatos) {
      // +1 porque acabas de agregar un plato
      setMenuAbierto(true);  // Abrir menú para elegir siguiente plato
    } else {
      setMenuAbierto(false); // Ya eligió todos los platos, cerrar menú
    }
  };

  const eliminarBarco = (barcoId) => {
    setBarcosSeleccionados((prev) => prev.filter((barco) => barco.id !== barcoId));

    // Opcional: si el barco activo es el que borraste, limpias también el activo y modal
    if (barcoActivoId === barcoId) {
      setBarcoActivoId(null);
      setModalDescripcionInfo(null);
    }
  };

  const eliminarPlato = (barcoId, nombrePlato) => {
    setBarcosSeleccionados((prev) =>
      prev.map((barco) =>
        barco.id === barcoId
          ? {
              ...barco,
              platos: barco.platos.filter((p) => p.nombre !== nombrePlato),
            }
          : barco
      )
    );
  };

  const actualizarAcompanante = (barcoId, tipo, valor) => {
  const nuevos = barcosSeleccionados.map((barco) => {
    if (barco.id !== barcoId) return barco;

    if (valor) {
      // Si se activa croqueta, desactivar ensalada; si se activa ensalada, desactivar croqueta
      return {
        ...barco,
        croqueta: tipo === "croqueta",
        ensalada: tipo === "ensalada",
      };
    } else {
      // Si se desactiva, solo cambiar ese valor, sin afectar el otro
      return {
        ...barco,
        [tipo]: false,
      };
    }
  });

  setBarcosSeleccionados(nuevos);
  onSeleccion(nuevos);  // si tienes esta función para pasar datos arriba
  validarYNotificar(nuevos);
  };

// Función para validar si todos los barcos tienen croqueta o ensalada
  const validarYNotificar = (barcos) => {
    const todosConAcompanante = barcos.length > 0 && barcos.every(
      (b) => b.croqueta === true || b.ensalada === true
    );

    onInteractuar(todosConAcompanante);  // función que avisa al padre si la validación pasó o no
  };

  const forzarCerrarModal = () => {
    setModalDescripcionInfo(null);
  };


  return (
    <div className="max-w-xl mx-auto mb-3">
      {!opcionInicialSeleccionada && (
        <Select
          options={opcionesIniciales}
          styles={customStyles}
          placeholder="Seleciona un Barco/torta"
          onChange={(opt) => agregarNuevoBarco(opt.value)}
        />

      )}

      {barcoActivoId && mostrarSegundoSelect && (
        <Select
          key={barcoActivoId}  // <--- Esto fuerza recrear Select al cambiar barco
          options={opcionesPlatosFiltrados}
          styles={customStyles}
          placeholder="Selecciona los Platos"
          onChange={(opt) => {
            agregarOActualizarPlato(barcoActivoId, opt.value);
            setMenuAbierto(false);
          }}
          menuPlacement="auto"
          menuIsOpen={menuAbierto}
          onMenuClose={() => setMenuAbierto(false)}
          onMenuOpen={() => setMenuAbierto(true)}
          ref={opcionesFiltradasRef}
        />
      )}

      {barcosSeleccionados.map((barco) => {
        const cantidadPlatos = barco.tamaño === "40" ? 4 : 3;
        const maxPlatosPermitidos = cantidadPlatos;

        return (
          <div
            key={barco.id}
            className="bg-white shadow-lg rounded-xl p-4 mt-4 space-y-4 relative" // relativo para posicionar el botón absolute
          >
            {/* Botón cerrar (X) en esquina superior derecha */}
            <button
              onClick={() => eliminarBarco(barco.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
              aria-label={`Eliminar barco de ${barco.tamaño} piezas`}
              title={`Eliminar barco de ${barco.tamaño} piezas`}
            >
            ×
            </button>

            <h2 className="text-lg font-bold text-red-600">
              {barco.tipo.toLowerCase() === "sushi torta"
                ? `Sushi Torta (${barco.tamaño} piezas)`
                : `Barco de ${barco.tamaño} piezas`} 
            </h2>


            {barco.platos.map((plato) => (
              <div
                key={plato.id}  // Mejor usar plato.id para key única
                className="flex items-center justify-between border-b pb-2 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <div className="font-bold text-gray-900">{plato.nombre}</div>

                  <button
                    className="text-red-600"
                    onClick={() => {
                      setModalDescripcionInfo({
                        idPlato: plato.id,
                        nombre: plato.nombre,
                      });
                      setBarcoActivoId(barco.id); // Muy importante para abrir modal en barco correcto
                    }}
                  >
                    <Info size={18} />
                  </button>
                </div>

                <button onClick={() => eliminarPlato(barco.id, plato.nombre)}>
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            ))}

            {/* Mostrar Croqueta / Ensalada si ya eligió todos los platos */}
            {barco.platos.length === maxPlatosPermitidos && (
  <div className="mt-4 text-sm flex justify-between">
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={barco.croqueta || false}
        onChange={(e) => {
          const isChecked = e.target.checked;

          // Actualiza el estado local del barco
          actualizarAcompanante(barco.id, "croqueta", isChecked);

          // Llama a validar y notificar para avisar al padre
          // (validarYNotificar está dentro del componente y se llama en actualizarAcompanante)
        }}
      />
      Croqueta
    </label>

    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={barco.ensalada || false}
        onChange={(e) => {
          const isChecked = e.target.checked;

          // Actualiza el estado local del barco
          actualizarAcompanante(barco.id, "ensalada", isChecked);

          // Llama a validar y notificar para avisar al padre
          // (validarYNotificar está dentro del componente y se llama en actualizarAcompanante)
        }}
      />
      Ensalada
    </label>
  </div>
            )}
          </div>
        );
      })}



    
      {/* MODAL INICIAL */}
     <ModalAnimado
  isOpen={mostrarModalInicial}
  onClose={() => {
    setMostrarModalInicial(false);
    setOpcionInicialSeleccionada(null); // reset primer select
    setMostrarSegundoSelect(false);     // ocultar segundo select
  }}
  className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-[90%] max-w-xs mx-auto mt-20 text-center relative outline-none border-0"
  overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
>
  {/* Botón ✕ */}
  <button
    onClick={() => {
      setMostrarModalInicial(false);
      setOpcionInicialSeleccionada(null);
      setMostrarSegundoSelect(false);
    }}
    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
  >
    ✕
  </button>

  {/* Mensaje según último barco */}
  {barcosSeleccionados.length > 0 && (() => {
    const ultimoBarco = barcosSeleccionados[barcosSeleccionados.length - 1];
    let texto;

    if (ultimoBarco.tipo.toLowerCase() === "sushi torta") {
      texto = `Sushi Torta (${ultimoBarco.tamaño} piezas)`;
    } else {
      texto = `Barco de ${ultimoBarco.tamaño} piezas`;
    }

    return (
      <>
        <h2 className="text-2xl font-bold mb-4 mt-6 text-red-600">
          ¡{texto} 🍣!
        </h2>
        <p className="mb-6 text-gray-700">
          ¡Excelente opción! A continuación, tendrás que elegir{" "}
          {ultimoBarco.tamaño === "40" ? 4 : 3} rolls.
          También podrás elegir croquetas o ensalada.
        </p>
      </>
    );
  })()}

  {/* Botón OK */}
  <button
    onClick={() => {
      handleModalOk();
      setMostrarModalInicial(false);
      setMostrarSegundoSelect(true); // mostrar segundo select
      onInteractuar(true);           // activar validación croqueta/ensalada
    }}
    className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
  >
    OK
  </button>
</ModalAnimado>



      {/* MODAL DE DESCRIPCIÓN */}
      {modalDescripcionInfo && barcoActivoId && (
       <ModalAnimado
  isOpen={!!modalDescripcionInfo}
  onClose={cerrarModal}
  className="bg-white p-6 rounded-lg shadow-lg w-[75%] max-w-md mx-auto relative outline-none"
  overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
>
  <>
    {/* Botón ✕ sin validaciones */}
    <button
      onClick={forzarCerrarModal}
      className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
    >
      ✕
    </button>

    <h2 className="text-xl text-red-600 font-bold mb-2">{modalDescripcionInfo?.nombre}</h2>
    <p className="font-semibold text-red-600 mb-1">
      {descripcionesPlatos[modalDescripcionInfo?.nombre]?.piezas}
    </p>

    {descripcionesPlatos[modalDescripcionInfo?.nombre]?.descripcion && (
      <p className="mb-3">
        {descripcionesPlatos[modalDescripcionInfo?.nombre].descripcion}
      </p>
    )}

    {descripcionesPlatos[modalDescripcionInfo?.nombre]?.permitirTempuraYFrio && (
      <div className="mt-3 flex flex-col gap-2">
        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={(() => {
              const barco = barcosSeleccionados.find(b => b.id === barcoActivoId);
              const plato = barco?.platos.find(p => p.id === modalDescripcionInfo.idPlato);
              return plato?.tempura || false;
            })()}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setBarcosSeleccionados(prev =>
                prev.map(barco => {
                  if (barco.id !== barcoActivoId) return barco;
                  return {
                    ...barco,
                    platos: barco.platos.map(plato =>
                      plato.id === modalDescripcionInfo.idPlato
                        ? { ...plato, tempura: isChecked, frio: isChecked ? false : plato.frio }
                        : plato
                    ),
                  };
                })
              );
            }}
            className="mr-2"
          />
          Tempura
        </label>

        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={(() => {
              const barco = barcosSeleccionados.find(b => b.id === barcoActivoId);
              const plato = barco?.platos.find(p => p.id === modalDescripcionInfo.idPlato);
              return plato?.frio || false;
            })()}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setBarcosSeleccionados(prev =>
                prev.map(barco => {
                  if (barco.id !== barcoActivoId) return barco;
                  return {
                    ...barco,
                    platos: barco.platos.map(plato =>
                      plato.id === modalDescripcionInfo.idPlato
                        ? { ...plato, frio: isChecked, tempura: isChecked ? false : plato.tempura }
                        : plato
                    ),
                  };
                })
              );
            }}
            className="mr-2"
          />
          Frío
        </label>
      </div>
    )}

    <p className="mt-4 font-semibold text-red-600">
      {descripcionesPlatos[modalDescripcionInfo?.nombre]?.preparacion || " "}
    </p>

    <div className="mt-6 flex justify-end">
      <button
        onClick={() => {
          if (validarPreparacion()) cerrarModal();
        }}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        OK
      </button>
    </div>
  </>
</ModalAnimado>

      )}

    </div>
  );

};

export default PlatoSelectorBarcos;
