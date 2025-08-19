import img from "../../img/promo.png"
import imgTottori from "../../img/tottori.jpeg"
import imgkyoto from "../../img/kyoto.jpeg"

export const descripcionesPlatos = {
  "Kawasakis ROLL": {
    piezas: "¡18 piezas de makis🍣!",
    ingredientes: {
      proteinas: ["Atún", "Salmón", "Cangrejo"],
      verduras: ["Aguacate", "Pepino"],
      
    },
    preparacion: "Unicamente Frios",
    precio: "1600,00"
  },
  "Tottori ROLL": {
     
    piezas: "¡10 piezas🍣!",
    descripcion: "Camarones al vapor, kani en tiras, y aguacate",
    topping: "Tartar de atun aderezado",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1440,00"

  },
  "Tochigui ROLL": {
     
    piezas: "¡10 piezas🍣!",
    descripcion: "Atún, cangrejo, aguacate y cebollín",
    topping: "wakame",
    aderezo: "maracuya",
    permitirTempuraYFrio: false,
    preparacion: "Unicamente Frios",
    precio: "1600,00"
  },
  "Kagawa ROLL": {
     
    piezas: "¡10 piezas🍣!",
    descripcion: "Doble camarón, aguacate, mango y queso crema",
    topping: "Camarones Tempura (Bañados en aderezos).",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1600,00"

  },
  "Hiroshima ROLL": {
     
    piezas: "¡10 piezas🍣!",
    descripcion: "Salmón, cangrejo, aguacate y queso crema",
    topping: "Tartar de salmón, aguacate y mango",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1600,00"
  },
  "Hyogos ROLL": {
     
    piezas: "¡4 piezas🍣!",
    descripcion: "Envuelto en hojas de arroz",
    ingredientes:[
        "Cangrejo(kani), aguacate y fuji",
        "Camarones al vapor, aguacate y cebollin",
        "Ensalada Dinamita",
        "Salmón, aguacate y cebollin"
    ],
    preparacion: "Unicamente Frios",
    precio: "1440,00"

  },
  "Yokohama ROLL": {
     
    piezas: "¡10 piezas🍣!",
    descripcion: "Camarónes, aguacate, queso crema, miel trufada y cebollin",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1440,00"
  },
  "Shibuya ROLL": { 
    piezas: "¡1 pieza🍣!",
    descripcion: "Enrrollado de pasta de camarones y aguacate", 
    permitirTempuraYFrio: false,
    preparacion: "Mitad frio, mitad Tempura",
    precio: "1280,00"
    
  },
  "Osaka ROLL": { 
     
    piezas: "¡1 pieza🍣!",
    descripcion: "Camarones, ensalada dinamita, aguacate y cebollin. (Sushi Hot dog)", 
    permitirTempuraYFrio: false,
    preparacion: "Unicamente Tempura",
    precio: "1280,00"
    
  },
 "Kyushu ROLL": { 
    
    piezas: "¡10 piezas🍣!",
    descripcion: "Cangrejo(kani), aguacate, queso crema,",
     topping: "Ensalada dinamita",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1280,00"
     
    },
 "Okinawa ROLL": { 
   
    piezas: "¡10 piezas🍣!",
    descripcion: "Salmón y queso crema,",
     topping: "Aguacate",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1280,00"
     
    },
 "Tokyo ROLL": { 
    piezas: "¡10 piezas🍣!",
    descripcion: "Camarones aguacate y queso crema,",
     topping: "Aguacate",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1120,00"
     
    },
 "Ukiyo ROLL": { 
    piezas: "¡10 piezas🍣!",
    descripcion: "Cangrejo(kani), camarones, aguacate, queso crema y pepino.",
     topping: "Kani tempura en tiras",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1440,00"
     
    },
 "Kobe ROLL": { 
    piezas: "¡10 piezas🍣!",
    descripcion: "Cangrejo(kani) y aguacate.",
     topping: "Platano",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1120,00"
     
    },
 "Toyama ROLL": { 
    piezas: "¡10 piezas🍣!",
    descripcion: "Ensalada de kani, cebollin y aguacate.",
     topping: "Tiras de kani con queso crema",
    permitirTempuraYFrio: true,
    preparacion: " ",
    precio: "1280,00"
     
    },

  "Tohoku ROLL": {
    piezas: "¡2 piezas🍣!",
    descripcion: "Sushi Sandwich",
    ingredientes:[
        "Cangrejo(kani), aguacate y queso crema",
        "Pasta de camarones y aguacate.",
        "Ensalada Dinamita",
        "Salmón, platano y queso crema"
    ],
    preparacion: "Unicamente Tempura",
    precio: "960,00"

  },
};

export const entradas = {
  "Ensalada Dinamita": {
    
    modal: false,
    precio: "960,00"
},

  "Ensalada Neptuno": {
    
     
     modal: false,
     precio: "1280,00"
  },

  "Tartar de salmon": {
    modal: false,
    precio: "1280,00"
  },

  "Croquetas de pescado": {
     
    piezas: "¡5 piezas de makis🍣!",
    preparacion: "Unicamente Tempura",
    modal: false,
    precio: "800,00"
  },

  "Croquetas de cangrejo": {
     
    piezas: "¡5 piezas🍣!",
    preparacion: "Unicamente Tempura",
    modal: false,
    precio: "800,00"

  },

  "Oniguiris": {
     
    piezas: "¡3 piezas🍣!",
    descripcion: "",
    ingredientes: [
      "Cangrejo(kani) con queso crema",
      "Camarones bañados en aderezo",
      "Ensalada Dinamita",
      "Salmón con mayo Spicy",
      "Tartar de Salmón",
      "Tartar de Atún",
    ],
    preparacion: " ",
    aderezo: "",
    modal: true,
    precio: "1120,00"

  },

  "Naganos": {
     
    piezas: "¡6 piezas🍣!",
    descripcion: "",
    ingredientes: [
      "Cangrejo(kani) con queso crema",
      "Pasta de camarones",
      "Ensalada Dinamita",
      "Salmón tempura y queso crema",
      "Aguacate y queso crema",
      "Platano y queso crema",

    ],
    preparacion: "Unicamente Tempura",
    aderezo: "",
    modal: true,
    precio: "1120,00"
  },
  
  "Niguiris": {
     
    piezas: "¡4 piezas🍣!",
    descripcion: "Salmón, cangrejo, atún y aguacate.",
    preparacion: " ",
    modal: true,
    precio: "1120,00"
  },
  "Miyazakis": {
     
  piezas: "¡2 piezas🍣!",
  descripcion: "Envuelta en base de arroz",
  modal: true,
  precio: "1120,00",
  piezasDetalles: [
    "Ensalada de kani con queso crema, incluye aderezos",
    "Camarones tempura, bañados en aderezo y aguacate"
  ]
}

};


export const extras = {
  "camarones Tempura": {
    
    modal: true,
    precio: "320,00"
  },
  "Cangrejo (kani)": {
    
    modal: true,
    precio: "320,00"
  },
  "Salmón": {
    
    modal: true,
    precio: "480,00"
  },
  "Atún": {
    
    modal: true,
    precio: "480,00"
  },
  "Aderezo Anguila": {
    
    modal: false,
    precio: "120,00"
  },
  "Aderezo Fuji": {
    
    modal: false,
    precio: "120,00"
  },
  "Mayo Spicy": {
    
    modal: false,
    precio: "120,00"
  },
  "Aderezo Maracuya": {
    
    modal: false,
    precio: "120,00"
  },
  "Wasabi": {
    
    modal: false,
    precio: "120,00"


  },
  "Gengibre": {
    
    modal: false,
    precio: "120,00"

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
          { nombre: "Promo Gohan ", precio: "2080,00" },
          { nombre: "Promo Classic", precio: "1760,00" }
        ],
      },
      {
        nombre: " Promo 30 Piezas",
        precio: "3360,00",
      },
      {
        nombre: " Promo 40 Piezas",
        precio: "4480,00",
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
        precio: "1440,00",
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
        precio: "3360,00",
      },
    ]
  },
];


