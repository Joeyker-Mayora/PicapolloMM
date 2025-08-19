import { useState, useEffect } from "react";

export const useItems = (storageKey) => {
  // Inicializamos desde sessionStorage según la clave
  const [platosSeleccionados, setPlatosSeleccionados] = useState(() => {
    const stored = sessionStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  // Guardamos automáticamente al cambiar
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(platosSeleccionados));
  }, [platosSeleccionados, storageKey]);

  const aumentarCantidad = (id, showSuccess) => {
    const producto = platosSeleccionados.find(p => p.id === id);
    if (!producto) return;

    setPlatosSeleccionados(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)
    );

    showSuccess?.(`Ahora tienes ${producto.cantidad + 1} ${producto.nombre}`);
  };

  const disminuirCantidad = (id, showSuccess) => {
    const producto = platosSeleccionados.find(p => p.id === id);
    if (!producto || producto.cantidad <= 1) return;

    setPlatosSeleccionados(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p)
    );

    showSuccess?.(`Ahora tienes ${producto.cantidad - 1} ${producto.nombre}`);
  };

  const eliminarItem = (id, showSuccess) => {
    const producto = platosSeleccionados.find(p => p.id === id);
    if (!producto) return;

    setPlatosSeleccionados(prev => prev.filter(p => p.id !== id));
    showSuccess?.(`Eliminaste ${producto.nombre}`);
  };

  return {
    platosSeleccionados,
    setPlatosSeleccionados,
    aumentarCantidad,
    disminuirCantidad,
    eliminarItem
  };
};
