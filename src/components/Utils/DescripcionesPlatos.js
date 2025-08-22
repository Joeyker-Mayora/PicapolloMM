import img from "../../img/promo.png"
import imgTottori from "../../img/tottori.jpeg"
import imgkyoto from "../../img/kyoto.jpeg"

export const combosPequeños = {
  "Super ": {
    piezas: "¡2 piezas de pollo!",
    tipo: "Cuadril y Muslo",
    descripcion: "Ensalada, 3 arepitas y Bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: " Papitas + Bebida",
    precio: "5"
  },
  "Jumbo": {
    piezas: "¡3 piezas de pollo!",
    tipo: "Muslo, cuadril y alita",
    descripcion: "Ensalada, 4 arepitas y Bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "7"
  },
  "Duo": {
    piezas: "¡4 piezas de pollo!",
    tipo: "Muslos, pechuga, cuadril y alita",

    descripcion: "Ensalada, 6 arepitas y Bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "10"
  },
  
  
};

export const combosGrandes = {
  "Familiar ": {
    piezas: "¡8 piezas de pollo!",
    tipo: "2 Muslos, 2 pechugas, 2 cuadril y 2 alitas",
    descripcion: "Ración de papas fritas, ensalada, 10 arepitas, 2 helados y bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: " Papitass + Bebida",
    precio: "20"
  },
  "Junior": {
    piezas: "¡6 piezas de pollo!",
    tipo: " 2 Muslo, 2 cuadril y 2 alitas",
    descripcion: "Ración de papas fritas, ensalada, 8 arepitas, 2 helados y bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "15"
  },
  "Gigante": {
    piezas: "¡5 piezas de pollo!",
    tipo: "Muslos, cuadril y 2 alitas",

    descripcion: "Ración de papas fritas, ensalada, 7 arepitas, 1 helado y bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "12"
  },
  "Bestial": {
    piezas: " ",
    tipo: " ",

    descripcion: "Un pollo completo, dos hamburguesas pollo crispy, racion de papas fritas, y tres helados de tinita",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "30"
  },
  
  
};


export const hamburguesasYMas = {
  "Burguer Pollo-Crispy": {
    descripcion: "Milanesa empanizada, ración de papas fritas, vegetales, salsas tradicionales y bebida (Refresco de 500ml)",
    permitirBebida: true,
    preparacion: "Papitas + Bebida ",
    precio: "5"
  },
  "Deluxe": {
    descripcion: "Pan de oregano, milanesa empanizada, ración de papas fritas, vegetales, salsas tradicionales ",
    permitirBebida: false,
    preparacion: "Papas Fritas ",
    precio: "5"
  },

  "Alitas de pollo": {
    piezas: "¡6 piezas de alita!",
    descripcion: "Ración de papas fritas, salsa BBQ, Tartara.",
    permitirBebida: false,
    preparacion: "Papas Fritas ",
    precio: "5"
  },
  "Tenders de pollo": {
    descripcion: " 5 Tenders, ración de papas fritas, un helado y bebida (Refresco de 500ml).",
    permitirBebida: true,
    preparacion: "Papas Fritas ",
    precio: "5"
  },
  "SalchiPollo": {
    descripcion: "100gr de papas fritas, salchichas y cop de pollo salsa BBQ, Tartara.",
    permitirBebida: false,
    preparacion: "Papas Fritas ",
    precio: "3"
  },
  "SalchiPapas": {
    descripcion: "100gr de papas fritas,100gr de salchichas y salsas tradicionales.",
    permitirBebida: false,
    preparacion: "Papas Fritas ",
    precio: "2"
  },

}


export const extras = {
  "Ración de Papitas": {
    
    modal: false,
    precio: "3"
  },
  "Ensalada": {
    
    modal: false,
    precio: "1"
  },
  "Racion de Arepitas": {
    
    modal: false,
    precio: "1"
  },
  "Helado Tinita": {
    
    modal: false,
    precio: "1"
  },
  "Cocacola 2lt": {
    
    modal: false,
    precio: "2"
  },
 
};

  


export const modals = [
  {
    nombre: "Promo1",
    img: img,
    opcionesPreparacion: ["Tempura", "Mitad frío / Mitad tempura", "Frío"],
    botones: ["20","30","40"],
    promos: [
      {
        nombre: "Promo 20 Piezas",
        subpromos: [
          { nombre: "Promo Gohan ", precio: "2080" },
          { nombre: "Promo Classic", precio: "1760" }
        ],
      },
      {
        nombre: " Promo 30 Piezas",
        precio: "3360",
      },
      {
        nombre: " Promo 40 Piezas",
        precio: "4480",
      }
    ]
  },
  {
    nombre: "Promo2",
    img: imgTottori,
    opcionesPreparacion: ["Tempura", "Frío"],
    botones: ["Lo quiero!"],
    promos: [
      {
        nombre: "Tottori ROLL",
        precio: "1440",
      },
    ]
  },
  {
    nombre: "Promo3",
    img: imgkyoto,
    botones: ["Lo quiero!"],
    promos: [
      {
        nombre: "Kyoto",
        precio: "3360",
      },
    ]
  },
];


