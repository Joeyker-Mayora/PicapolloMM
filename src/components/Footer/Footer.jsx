import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import Picapollo from "../../img/Picapollo.png";
import "leaflet/dist/leaflet.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

 useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    // Mostrar footer cuando el usuario scrollee al menos 25% de la altura de la ventana
    if (scrollTop >= windowHeight * 0.25) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // ejecutar al inicio
  return () => window.removeEventListener("scroll", handleScroll);
}, []);




  const logoIcon = new Icon({
    iconUrl: Picapollo,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div
      ref={footerRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(50px)",
        transition: "opacity 1s, transform 1s",
      }}
      className="bg-white text-black px-4 py-6 mt-12 sm:mt-16"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-center">
        <div className="flex items-center space-x-3">
          <img
            src={Picapollo}
            alt="Logotipo PicaPollo"
            className="w-40 h-30 object-cover mx-auto"
          />
        </div>

        <div className="flex space-x-6 text-xl justify-center mt-2">
          <a
            href="https://www.instagram.com/picapollo10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-800 hover:text-red-600 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/584241592293"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 transition"
          >
            <FaWhatsapp />
          </a>
        </div>

        <p className="text-sm mt-4">📍 Sector Cocoteros, Maiquetia, Vargas</p>

        <div className="w-full h-64 mt-4 rounded overflow-hidden">
          <MapContainer
            center={[10.5977267, -66.9543170]}
            zoom={16}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[10.5977267, -66.9543170]} icon={logoIcon}>
              <Popup>PicaPollo 📍</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-4 pt-4 text-center text-sm">
        © {new Date().getFullYear()} PicapolloMM. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default Footer;
