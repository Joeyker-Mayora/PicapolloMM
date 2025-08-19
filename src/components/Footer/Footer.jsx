import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import Logotipo from "../../img/Logotipo.png";

const Footer = () => {
  return (
    <div className="bg-black text-white px-4 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
<img src={Logotipo} alt="Logotipo Japan Food" className="w-10 h-10 rounded-full object-cover" />
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Sawarabi Mincho', serif" }}
          >
            JAPAN FOOD
          </h1>
        </div>

        {/* Íconos siempre centrados */}
        <div className="flex space-x-6 text-xl justify-center">
          
          <a
            href="https://www.instagram.com/japanfood10?igsh=MTN4OXc3cnk4cjY1MQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/584241592293"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-600 mt-4 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Japan Food. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default Footer;
