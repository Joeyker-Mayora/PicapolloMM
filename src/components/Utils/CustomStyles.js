import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: "transparent", // quitamos el borde gris
    boxShadow: state.isFocused
      ? "0 8px 24px rgba(0, 0, 0, 0.15)"
      : "0 4px 12px rgba(0, 0, 0, 0.08)", // sombra clara o fuerte
    minHeight: "44px",
    paddingLeft: "8px",
    fontSize: "1rem",
    borderRadius: 6,
    cursor: "pointer",
    transition: "box-shadow 0.3s ease",
    backgroundColor: "#fff",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "transparent",
    color: "#374151",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: state.isSelected ? "600" : "400",
    transition: "background-color 0.15s ease",
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.selectProps.menuIsOpen ? "transparent" : "#374151",
    fontWeight: "600",
  }),
  input: (base) => ({
    ...base,
    color: "#374151",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    textAlign: "left",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#6b7280" : "#9ca3af",
    padding: 4,
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#6b7280",
    },
  }),
  indicatorSeparator: (base) => ({
  ...base,
  backgroundColor: "#e5e7eb", // un gris claro sutil
  marginTop: 8,
  marginBottom: 8,
  width: "1px",
}),

};

export const ModalAnimado = ({ isOpen, onClose, children, className = "", overlayClassName = "" }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${overlayClassName}`}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
           exit={{ y: "100vh", opacity: 0 }}  
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`bg-white p-6 rounded-lg shadow-lg w-[75%] max-w-md mx-auto relative text-left ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

 export const PageModal = ({ mostrarModal, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (mostrarModal) {
      setLoading(true);
      setShowCheck(false);

      const loaderTimer = setTimeout(() => {
        setLoading(false);
        setShowCheck(true);
      }, 1000); // Loader más rápido

      const closeTimer = setTimeout(() => {
        setShowCheck(false);
        onComplete();
      }, 2500); // Tiempo suficiente para ver el check

      return () => {
        clearTimeout(loaderTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [mostrarModal, onComplete]);

  return (
    <AnimatePresence>
      {mostrarModal && (loading || showCheck) && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl flex flex-col items-center min-w-[280px] max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                  Cargando...
                </p>
              </motion.div>
            )}

            {showCheck && (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full text-white text-3xl">
                  ✔
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
                  ¡Hecho!
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};