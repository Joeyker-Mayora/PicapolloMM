import React from "react";
import { motion } from "framer-motion";

const pulseAnimation = {
  scale: [1, 1.1, 1], // aumenta y vuelve a su tamaño original
};

const pulseTransition = {
  duration: 1.2,
  repeat: Infinity,
  repeatType: "loop",
  ease: "easeInOut",
};

const SocialFixed = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50">
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/584124835918" // 👉 cambia este número
        target="_blank"
        rel="noopener noreferrer"
        animate={pulseAnimation} // pulso constante
        transition={pulseTransition}
        whileHover={{ scale: 1.25, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-10 h-10"
        />
      </motion.a>

      {/* Instagram */}
      <motion.a
        href="https://www.instagram.com/picapollomm?igsh=MWs3NGpoMHl6ZnlqcQ==" // 👉 cambia por tu usuario
        target="_blank"
        rel="noopener noreferrer"
        animate={pulseAnimation} // pulso constante
        transition={pulseTransition}
        whileHover={{ scale: 1.25, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram"
          className="w-10 h-10"
        />
      </motion.a>
    </div>
  );
};

export default SocialFixed;
