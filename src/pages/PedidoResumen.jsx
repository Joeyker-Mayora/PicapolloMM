import { useEffect, useState } from "react";
import { FaWhatsapp, FaPlus, FaCopy } from "react-icons/fa";
import {showError,showSuccess} from "../components/Utils/toastUtils"
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageModal } from "../components/Utils/CustomStyles";
import Picapollo from "../img/Picapollo.png"




const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const copyToClipboard = (text) => {
  // Extraer sólo dígitos usando expresión regular
  const soloNumeros = text.match(/\d+/g)?.join("") || "";
  navigator.clipboard.writeText(soloNumeros).then(() => {
    showSuccess("Copiado al portapapeles");
  });
};
const PedidoResumen = () => {
  const [pago, setPago] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detalleProductos, setDetalleProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [urlImagen, setUrlImagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [denominacion, setDenominacion] = useState("");
  const [tarifaDelivery, setTarifaDelivery] = useState(0);
  const [platosPequeños, setplatosPequeños] = useState([]);
  const [platosVariedad, setplatosVariedad] = useState([]);
  const [extras, setExtras] = useState([]);
  const [platosGrandes, setplatosGrandes] = useState([]);
  const [numeroPromo, setNumeroPromo] = useState(null);
  const [preparacionUsuario, setPreparacionUsuario] = useState("");
  const [ingredientesPorPlato, setIngredientesPorPlato] = useState({});
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null); // guarda el índice o id del producto
  const [promosSeleccionadas, setPromosSeleccionadas] = useState([])



  const sonidoConfirmacion = new Audio("/success.mp3");

 const formatearPrecio = (precio, metodoPago) => {
  // Convertimos el precio a número
  const precioNum = convertirAPrecioNumero(precio);

  if (metodoPago === "Pago Móvil") {
    // Convertimos de USD a Bs usando la tasa (ejemplo: 160 Bs/USD)
    const precioBs = precioNum * 145;
    return precioBs.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " Bs";
  }

  // Para los demás métodos, mostramos en USD
  return precioNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " USD";
};



  const convertirAPrecioNumero = (valor) => {
    if (typeof valor === "number") return valor;
    if (typeof valor === "string") {
      const limpio = valor.replace(/\./g, "").replace(",", ".");
      const num = parseFloat(limpio);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };




 useEffect(() => {
  try {
    const platos = JSON.parse(sessionStorage.getItem("platosPequeños")) || [];
    const variedad = JSON.parse(sessionStorage.getItem("platosVariedad")) || [];
    const extras = JSON.parse(sessionStorage.getItem("extrasSeleccionados")) || [];
    const platosGrandes = JSON.parse(sessionStorage.getItem("platosGrandes")) || [];
    const promos = JSON.parse(sessionStorage.getItem("promosSeleccionadas")) || [];
    const ingredientesPorPlatoData = JSON.parse(sessionStorage.getItem("ingredientesSeleccionadosPorPlato")) || {};

    // 🔹 Cambio aquí: no más || {}
    const datosGuardados = sessionStorage.getItem("datosPedido");
    const datos = datosGuardados ? JSON.parse(datosGuardados) : null;

    const esDelivery = datos?.entrega === "Delivery";
    const tarifa = esDelivery && datos?.tarifaDelivery
      ? parseFloat(datos.tarifaDelivery.toString().replace(",", "."))
      : 0;

    setplatosPequeños(platos);
    setplatosVariedad(variedad);
    setExtras(extras);
    setplatosGrandes(platosGrandes);
    setPromosSeleccionadas(promos);
    setIngredientesPorPlato(ingredientesPorPlatoData);
    setTarifaDelivery(tarifa);

    // 🚫 Importante: NO hagas sessionStorage.setItem("datosPedido", ...)
    // en este componente. Solo lectura.
  } catch (error) {
    console.error("Error al cargar datos desde sessionStorage", error);
    setplatosPequeños([]);
    setplatosVariedad([]);
    setExtras([]);
    setplatosGrandes(null);
    setPromosSeleccionadas([]);
    setIngredientesPorPlato({});
    setTarifaDelivery(0);
  }
}, []);


useEffect(() => {
  const productos = [];
  const agregarProducto = (nombre, precio) => {
    if (!nombre) return;
    const precioNum = convertirAPrecioNumero(precio);
    productos.push({ nombre, precio: precioNum });
  };

  const usadosComoSubextras = new Set();

  platosPequeños.forEach((plato) => {
    const nombre = typeof plato.nombre === "string" ? plato.nombre : plato.nombre?.es || plato.nombre?.value || "Roll sin nombre";
    const cantidad = plato.cantidad || 1;
    const precioPlato = convertirAPrecioNumero(plato.precio) * cantidad;

    

    productos.push({ nombre: `${nombre} (x${cantidad})`, precio: precioPlato,  });
  });

  platosGrandes.forEach((plato) => {
    const nombre = typeof plato.nombre === "string" ? plato.nombre : plato.nombre?.es || plato.nombre?.value || "Roll sin nombre";
    const cantidad = plato.cantidad || 1;
    const precioPlato = convertirAPrecioNumero(plato.precio) * cantidad;

    

    productos.push({ nombre: `${nombre} (x${cantidad})`, precio: precioPlato,  });
  });
  
  
  promosSeleccionadas.forEach((item) => {
  const preparacion = item?.preparacion || "";
  const precio = convertirAPrecioNumero(item?.precio || item?.promo?.precio);

  // Detectar si es sub-promo "Gohan" o "Classic"

  productos.push({
    nombre: item?.promo?.nombre || item?.nombre || "",
    preparacion,
    precio,
    esPromo: true,
  });
});


  platosVariedad.forEach((plato) => {
    const nombre = typeof plato.nombre === "string" ? plato.nombre : plato.nombre?.es || plato.nombre?.value || "Entrada sin nombre";
    const cantidad = plato.cantidad || 1;
    agregarProducto(`${nombre} (x${cantidad})`, convertirAPrecioNumero(plato.precio) * cantidad);
  });

  extras.forEach((extra) => {
    if (usadosComoSubextras.has(extra)) return;
    const nombre = extra?.nombre || "Extra sin nombre";
    const cantidad = extra?.cantidad || 1;
    agregarProducto(`${nombre} (x${cantidad})`, convertirAPrecioNumero(extra.precio) * cantidad);
  });

  setDetalleProductos(productos);
}, [platosPequeños, platosGrandes, platosVariedad, extras, promosSeleccionadas]);

useEffect(() => {
  const nuevoTotal = detalleProductos.reduce((acc, item) => {
    const precioBase = item.precio || 0;
    const subextrasTotal = item.subextras?.reduce((sum, sub) => sum + (sub.precio || 0), 0) || 0;
    return acc + precioBase + subextrasTotal;
  }, 0);

  setTotal(nuevoTotal + (tarifaDelivery || 0));
}, [detalleProductos, tarifaDelivery]);



 const handleImagenChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showError("La imagen debe pesar menos de 5MB");
    return;
  }

  setImagen(file);
  setSubiendo(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // 👇 aquí defines la carpeta de destino
  formData.append("folder", "app2_comprobantes"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      setUrlImagen(data.secure_url);
      showSuccess("Imagen subida ");
    } else {
      showError("Error subiendo imagen a Cloudinary");
      console.error("Respuesta inválida de Cloudinary:", data);
    }
  } catch (error) {
    showError("Error subiendo la imagen");
    console.error("Error al subir imagen a Cloudinary:", error);
  } finally {
    setSubiendo(false);
  }
};


  const confirmarEliminacion = (info) => {
    setProductoAEliminar(info);
    setMostrarModalEliminar(true);
  };

  const eliminarProducto = (producto) => {
  if (producto.esPromo) {
    const numeroProducto = producto.nombre?.match(/\d+/)?.[0]; 
    const nuevasPromos = promosSeleccionadas.filter(p => {
      const numeroPromo = p.promo?.numero;
      const precioPromo = convertirAPrecioNumero(p.precio);
      return !(numeroPromo === numeroProducto && precioPromo === producto.precio);
    });

    setPromosSeleccionadas(nuevasPromos);
    sessionStorage.setItem("promosSeleccionadas", JSON.stringify(nuevasPromos));
  } else {
    const nombreSinCantidad = producto.nombre.replace(/\s\(x\d+\)/, "");

    // Revisar y eliminar de platosPequeños
    const nuevosPequeños = platosPequeños.filter(plato => {
      const nombrePlato = typeof plato.nombre === "string" ? plato.nombre : plato.nombre?.es || plato.nombre?.value;
      return nombrePlato !== nombreSinCantidad;
    });
    if (nuevosPequeños.length !== platosPequeños.length) {
      setplatosPequeños(nuevosPequeños);
      sessionStorage.setItem("platosPequeños", JSON.stringify(nuevosPequeños));
      showSuccess("Producto eliminado");
      return;
    }

    // Revisar y eliminar de platosGrandes
    const nuevosGrandes = platosGrandes.filter(plato => {
      const nombrePlato = typeof plato.nombre === "string" ? plato.nombre : plato.nombre?.es || plato.nombre?.value;
      return nombrePlato !== nombreSinCantidad;
    });
    if (nuevosGrandes.length !== platosGrandes.length) {
      setplatosGrandes(nuevosGrandes);
      sessionStorage.setItem("platosGrandes", JSON.stringify(nuevosGrandes));
      showSuccess("Producto eliminado");
      return;
    }

    // Revisar y eliminar de platosVariedad
    const nuevasVariedad = platosVariedad.filter(plato => plato.nombre !== nombreSinCantidad);
    if (nuevasVariedad.length !== platosVariedad.length) {
      setplatosVariedad(nuevasVariedad);
      sessionStorage.setItem("platosVariedad", JSON.stringify(nuevasVariedad));
      showSuccess("Producto eliminado");
      return;
    }

    // Revisar y eliminar de extras
    const nuevosExtras = extras.filter(extra => extra.nombre !== nombreSinCantidad);
    setExtras(nuevosExtras);
    sessionStorage.setItem("extrasSeleccionados", JSON.stringify(nuevosExtras));
  }
};


const handleEnviar = () => { 
  if (!pago) {
    showError("Elegí un método de pago.");
    return;
  }
  if ((pago === "Pago Móvil" || pago === "Zelle") && (!urlImagen || referencia.length !== 4)) {
    showError("Subí la imagen y colocá los 4 dígitos del comprobante.");
    return;
  }
  if (pago === "Efectivo" && !denominacion) {
    showError("Por favor indica con qué billete vas a pagar.");
    return;
  }

  // 🔹 SIEMPRE leemos del sessionStorage en tiempo real
  const datos = JSON.parse(sessionStorage.getItem("datosPedido")) || {};
  const extrasSeleccionados = JSON.parse(sessionStorage.getItem("extrasSeleccionados")) || [];
  const platosPequeños = JSON.parse(sessionStorage.getItem("platosPequeños")) || [];
  const platosGrandes = JSON.parse(sessionStorage.getItem("platosGrandes")) || {};
  const promo = JSON.parse(sessionStorage.getItem("promosSeleccionadas")) || [];
  const platosVariedad = JSON.parse(sessionStorage.getItem("platosVariedad")) || [];
  const ingredientesPorPlato = JSON.parse(sessionStorage.getItem("ingredientesSeleccionadosPorPlato") || "{}");

  // --- FILTRAR platos que están dentro de barcos ---
  const platosEnBarcoNombres = new Set();
  if (platosGrandes.barcos?.length > 0) {
    platosGrandes.barcos.forEach(barco => {
      barco.platos.forEach(plato => {
        const nombrePlato =
          typeof plato.nombre === "string"
            ? plato.nombre
            : plato.nombre?.es || plato.nombre?.value || JSON.stringify(plato.nombre);
        platosEnBarcoNombres.add(nombrePlato);
      });
    });
  }

  // --- Mensaje platos ---
  let mensajePlatos = "";
  platosPequeños.forEach((plato) => {
    const nombrePlato =
      typeof plato.nombre === "string"
        ? plato.nombre
        : plato.nombre?.es || plato.nombre?.value || JSON.stringify(plato.nombre);

    if (platosEnBarcoNombres.has(nombrePlato)) return;

    mensajePlatos += `- ${nombrePlato} (x${plato.cantidad || 1})\n`;

    const ingredientes = ingredientesPorPlato[plato.id];
    if (ingredientes) {
      if (Array.isArray(ingredientes)) {
        mensajePlatos += `  • Ingredientes: ${ingredientes.join(", ")}\n`;
      } else {
        if (ingredientes.proteinas?.length) mensajePlatos += `  • Proteínas: ${ingredientes.proteinas.join(", ")}\n`;
        if (ingredientes.verduras?.length) mensajePlatos += `  • Verduras: ${ingredientes.verduras.join(", ")}\n`;
      }
    }

    if (plato.tempura) mensajePlatos += `  • Tempura\n`;
    if (plato.frio) mensajePlatos += `  • Frío\n`;

    const extrasParaEstePlato = extrasSeleccionados.filter(extra => extra.extraAplicado === nombrePlato);
    extrasParaEstePlato.forEach((extra) => {
      const tipoExtra = extra.relleno ? "Relleno" : extra.topping ? "Topping" : "Extra";
      mensajePlatos += `  • Extra: ${extra.nombre} - ${tipoExtra}\n`;
    });
  });

  // --- Mensaje variedad ---
  let mensajevariedad = "";
  platosVariedad.forEach((plato) => {
    const nombrePlato = typeof plato.nombre === "string"
      ? plato.nombre
      : plato.nombre?.es || plato.nombre?.value || JSON.stringify(plato.nombre);

    mensajevariedad += `- ${nombrePlato} (x${plato.cantidad || 1})\n`;

    if (plato.ingredientes?.length) {
      mensajevariedad += `  • Sabores:\n`;
      plato.ingredientes.forEach(({ nombre, tempuraFrio }) => {
        const mostrarTempuraFrio = nombrePlato !== "Naganos" && tempuraFrio;
        mensajevariedad += `    - ${nombre}${mostrarTempuraFrio ? ` (${tempuraFrio})` : ""}\n`;
      });
    }

    if (plato.tempura && nombrePlato !== "Naganos") mensajevariedad += `  • Tempura (plato)\n`;
    if (plato.frio && nombrePlato !== "Naganos") mensajevariedad += `  • Frío (plato)\n`;
  });

  // --- Mensaje extras generales ---
  let mensajeExtrasGenerales = "";
  const extrasGenerales = extrasSeleccionados.filter(extra => !extra.extraAplicado);
  if (extrasGenerales.length > 0) {
    mensajeExtrasGenerales += `🍱 *Extras:*\n`;
    extrasGenerales.forEach((extra) => {
      mensajeExtrasGenerales += `- ${extra.nombre} (x${extra.cantidad || 1})\n`;
      if (extra.relleno) mensajeExtrasGenerales += `  • Relleno\n`;
      if (extra.topping) mensajeExtrasGenerales += `  • Topping\n`;
    });
    mensajeExtrasGenerales += `\n`;
  }

  // --- Mensaje barcos ---
  let mensajeCombos = "";
  if (platosGrandes.barcos?.length > 0) {
    mensajeCombos += `\n`;
    platosGrandes.barcos.forEach((barco) => {
      const esSushiTorta = barco.tipo?.toLowerCase().includes("sushi");
      const titulo = esSushiTorta ? `*- ${barco.tipo}*` : `*- Barco ${barco.tamaño} piezas*`;
      mensajeCombos += `${titulo}\n`;
      if (barco.croqueta) mensajeCombos += `• Croqueta incluida\n`;
      if (barco.ensalada) mensajeCombos += `• Ensalada incluida\n`;
      mensajeCombos += `🍣 *Platos:*\n`;
      barco.platos.forEach((plato) => {
        mensajeCombos += `- ${plato.nombre} (x${plato.cantidad || 1})\n`;
        const detalles = [];
        if (plato.tempura) detalles.push("Tempura");
        if (plato.frio) detalles.push("Frío");
        if (detalles.length > 0) mensajeCombos += `  • ${detalles.join(" / ")}\n`;
      });
      mensajeCombos += `\n`;
    });
  }

  // --- Mensaje promociones ---
let mensajePromo = "";

if (promo && promo.length > 0) {
  mensajePromo += `🎁 *Promociones:*\n`;

  promo.forEach((p) => {
    const nombre = p?.nombre || "";
    const preparacionArray = p?.preparacion ? [p.preparacion] : p?.opcionesPreparacion || [];
    const preparacion = preparacionArray.join(" / ");

    // Mostrar nombre principal
    mensajePromo += `• ${nombre}\n`;

    // Mostrar preparación si existe
    if (preparacion) {
      mensajePromo += `   • ${preparacion}\n`;
    }
  });
}


// Usalo luego en WhatsApp:
// `https://api.whatsapp.com/send?text=${encodeURIComponent(mensajePromo)}`





  // --- Construcción final ---
  let mensaje = "*Nuevo pedido:\n";
  if (mensajePromo) mensaje += mensajePromo;
  if (mensajePlatos) mensaje += `🍗 *Combos:*\n${mensajePlatos}\n`;
  if (mensajeCombos) mensaje += mensajeCombos;
  if (mensajevariedad) mensaje += `*\n${mensajevariedad}\n`;
  if (mensajeExtrasGenerales) mensaje += mensajeExtrasGenerales;
  mensaje += `💰 *Total:* ${formatearPrecio(total, pago)}\n\n`;
  mensaje += `🛵 *Delivery:* ${formatearPrecio(tarifaDelivery, pago)}\n\n`;
  mensaje += `🙍‍♂️ *Nombre:* ${datos.nombre}\n`;
  mensaje += `📞 *Teléfono:* ${datos.telefono}\n`;
  mensaje += `🏠 *Forma de entrega:* ${datos.entrega}\n\n`;
  mensaje += `🏠 *Dirección:* ${datos.direccion}\n\n`;
  mensaje += `💳 *Método de pago:* ${pago}\n`;
  if (pago === "Pago Móvil" || pago === "Zelle") {
    mensaje += `🔢 *Referencia:* ${referencia}\n`;
    mensaje += `🔗 *Comprobante:* ${urlImagen}\n`;
  }
  if (pago === "Efectivo") {
    mensaje += `💵 *Billete:* ${denominacion}\n`;
  }

  // --- Envío con modal ---
  setMostrarModal(true);

// Reproducir sonido después de 1 segundo
if (sonidoConfirmacion) {
  setTimeout(() => {
    sonidoConfirmacion.play();
  }, 1000);
}

// Redirigir a WhatsApp después de 2 segundos
setTimeout(() => {
  const numeroWhatsApp = "584124835918";
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.location.href = urlWhatsApp;
  setMostrarModal(false);
}, 2000);

};



 return (
  <div className="pt-4 pb-6 min-h-screen flex items-start justify-center fondo px-6">
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center relative mt-20 sm:mt-16">
  {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <img
          src={Picapollo}
          alt="Logotipo PicaPollo"
          className="w-40 h-30 object-cover"
        />
      </div>
      <p className="text-red-600 font-bold mb-2 text-center">Resumen</p>
      <div className="text-sm text-left space-y-1 mb-4">
 {detalleProductos.map((item, index) => {

 if (item.esPromo) {
  let textoPromo = `${item.nombre}`;

  // Si es sub-promo Gohan o Classic, agregamos "20 piezas"
  if (item.nombre.includes("Gohan") || item.nombre.includes("Classic")) {
    textoPromo += " 20 piezas";
  }

  return (
    <div key={item.id || index} className="flex flex-col gap-1 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => confirmarEliminacion(item)}
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
          <span>{textoPromo}</span>
        </div>
        <span className="font-bold text-red-600">
          {formatearPrecio(item.precio)}
        </span>
      </div>
    </div>
  );
}



  if (item.tipo === "entrada") {
    return (
      <div key={item.id || index} className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => confirmarEliminacion(item)}  
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
          <span>{item.nombre}</span>
        </div>
        <span className="font-bold text-red-600">{formatearPrecio(item.precio)}</span>
      </div>
    );
  }

  return (
    <div key={item.id || index} className="flex flex-col gap-1 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => confirmarEliminacion(item)} 
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
          <span>{item.nombre}</span>
        </div>
        <span className="font-bold text-red-600">
          {formatearPrecio(item.precio)}
        </span>
      </div>

      {item.subextras?.length > 0 && (
        <div className="ml-7 text-sm text-gray-700 space-y-1">
          {item.subextras.map((extra, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    confirmarEliminacion({
                      ...extra,
                      tipo: "extra",
                      id: item.id,
                      extraIndex: i,
                    })
                  }
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar extra"
                >
                  <Trash2 size={16} />
                </button>
                <span>• Extra: {extra.nombre}</span>
              </div>
              <span className="font-bold text-red-600">
                {formatearPrecio(extra.precio)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
})}






        {tarifaDelivery > 0 && (
          <div className="flex justify-between mt-2">
            <span>Tarifa Delivery</span>
            <span className="text-red-600 font-bold">{formatearPrecio(tarifaDelivery)}</span>
          </div>
        )}

        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-red-600">{formatearPrecio(total, pago)}</span>
        </div>
      </div>

      {/* Método de pago */}
      <p className="text-red-600 font-bold mb-2 text-center">Método de pago</p>
      <div className="flex flex-wrap justify-center gap-3 mb-4 text-sm">
        {["Pago Móvil", "Zelle", "Efectivo", "Tarjeta"].map((metodo) => (
          <label key={metodo} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pago"
              value={metodo}
              checked={pago === metodo}
              onChange={() => {
                setPago(metodo);
                setReferencia("");
                setUrlImagen("");
                setImagen(null);
              }}
              className="cursor-pointer"
            />
            {metodo}
          </label>
        ))}
      </div>

      {(pago === "Pago Móvil" || pago === "Zelle") && (
        <>
          <div className="mb-4 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none">
            {pago === "Pago Móvil" ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span><strong>Banco:</strong>Banesco</span>
                  <button onClick={() => copyToClipboard("Banesco")} className="text-red-600 hover:text-red-800" title="Copiar">
                    <FaCopy />
                  </button>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span><strong>Cédula:</strong> V-20.781.439</span>
                  <button onClick={() => copyToClipboard("V-20.781.439")} className="text-red-600 hover:text-red-800" title="Copiar">
                    <FaCopy />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Teléfono:</strong> 0424-2148900</span>
                  <button onClick={() => copyToClipboard("0424-2148900")} className="text-red-600 hover:text-red-800" title="Copiar">
                    <FaCopy />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span><strong>Cuenta:</strong>Marialejandrap08@gmail.com</span>
                  <button onClick={() => copyToClipboard("Marialejandrap08@gmail.com")} className="text-red-600 hover:text-red-800" title="Copiar">
                    <FaCopy />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Nombre:</strong>Marialejandra Peñaloza</span>
                  <button onClick={() => copyToClipboard("Marialejandra Peñaloza")} className="text-red-600 hover:text-red-800" title="Copiar">
                    <FaCopy />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <label
              htmlFor="uploadInput"
              className={`cursor-pointer border border-dashed border-gray-400 rounded-lg w-32 h-32 flex flex-col items-center justify-center text-gray-600 relative overflow-hidden
                ${subiendo ? "opacity-50 cursor-wait" : "hover:bg-red-50"}`}
              title="Subir comprobante"
            >
              {!urlImagen && !subiendo && (
                <>
                  <FaPlus size={32} />
                  <span className="text-xs mt-2">toca para apregar el comprobante</span>
                </>
              )}
              {subiendo && <span className="text-sm animate-pulse">Subiendo...</span>}
              {urlImagen && !subiendo && (
                <img
                  src={urlImagen}
                  alt="Comprobante"
                  className="object-cover w-full h-full rounded-lg absolute top-0 left-0"
                />
              )}
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                disabled={subiendo}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-3">
            <label htmlFor="referencia" className="block mb-1 text-sm font-semibold text-gray-700">
              Últimos 4 dígitos de referencia
            </label>
            <input
              id="referencia"
              type="text"
              maxLength={4}
              value={referencia}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,4}$/.test(val)) setReferencia(val);
              }}
              className="mb-4 w-20 p-2 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none text-center"
              placeholder="1234"
            />
          </div>
        </>
      )}

      {pago === "Efectivo" && (
        <div className="mt-4 flex flex-col items-center text-center">
          <label
            htmlFor="denominacion"
            className="mb-2 text-sm font-semibold text-gray-700"
          >
            ¿Con qué billete vas a pagar?
          </label>
          <div className="flex items-center border border-gray-200 rounded shadow-md w-32">
            <span className="px-2 text-gray-600 font-bold">$</span>
            <input
              id="denominacion"
              type="text"
              min={1}
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
              className="p-2 w-full bg-transparent placeholder-gray-400 focus:outline-none text-center"
              placeholder="10"
            />
          </div>
        </div>
      )}

      {pago === "Tarjeta" && (
        <div className="mb-4 w-full p-3 border border-gray-200 rounded shadow-md bg-transparent placeholder-gray-400 focus:outline-none">
          <div className="text-center text-gray-700">
            <strong>Información:</strong> Sólo para consumición en el local, Cuando guste puede cancelar, ¡Muchas Gracias!
          </div>
        </div>
      )}

      <button
        className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-800 text-white px-10 py-2 mt-6 rounded transition mx-auto flex items-center justify-center gap-2"
        onClick={handleEnviar}
      >
        Enviar a WhatsApp <FaWhatsapp size={20} />
      </button>

     

    {/* Modal de confirmación para eliminar producto */}
<AnimatePresence>
  {mostrarModalEliminar && (
    <motion.div
      key="modal-eliminar"
      initial={{ x: "100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100vw", opacity: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]"
    >
      <div className="bg-neutral-900 rounded-xl p-6 shadow-xl w-[90%] max-w-xs text-white">
        <h3 className="text-center text-lg font-bold mb-6">
          {productoAEliminar?.tipo === "extra"
            ? "¿Deseás eliminar este extra?"
            : "¿Deseás eliminar este producto?"}
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              eliminarProducto(productoAEliminar);
              setMostrarModalEliminar(false);
              setProductoAEliminar(null);
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition text-white font-semibold py-2 rounded"
          >
            Sí, eliminar
          </button>
          <button
            onClick={() => {
              setMostrarModalEliminar(false);
              setProductoAEliminar(null);
            }}
            className="w-full bg-neutral-700 hover:bg-neutral-600 transition text-white font-semibold py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
    <PageModal 
      mostrarModal={mostrarModal} 
      onComplete={() => setMostrarModal(false)} 
    />
  </div>
);



};

export default PedidoResumen;
