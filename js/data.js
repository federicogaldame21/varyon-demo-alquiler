// Datos ficticios de la demo. El modelo sigue la base real: cliente, nivel_cliente, categoria,
// equipo, estado_equipo, contrato, detalle_contrato, pago, devolucion y registro_danio.
const NIVELES = {
  bronce: { nombre: "Bronce", maxEquipos: 2, garantia: 0.30 },
  plata:  { nombre: "Plata",  maxEquipos: 4, garantia: 0.20 },
  oro:    { nombre: "Oro",    maxEquipos: 6, garantia: 0.10 },
};
const METODOS = ["Efectivo", "Transferencia", "Débito", "Crédito"];
const CATEGORIAS = [
  { id: "per", nombre: "Perforación", color: "#2f6fde" },
  { id: "cor", nombre: "Corte y desbaste", color: "#d6452f" },
  { id: "obr", nombre: "Obra", color: "#7a5af5" },
  { id: "ene", nombre: "Energía", color: "#1f9d6a" },
  { id: "lim", nombre: "Limpieza", color: "#0b8ea8" },
  { id: "jar", nombre: "Jardín", color: "#5c8a1e" },
];
// [id, nombre, marca, categoria, tarifa por día, valor de reposición]
const EQUIPOS = [
  ["e01", "Taladro percutor 13 mm", "Ryobi", "per", 6500, 180000],
  ["e02", "Taladro percutor 13 mm", "Bosch", "per", 6500, 180000],
  ["e03", "Rotomartillo SDS Plus", "Makita", "per", 11000, 420000],
  ["e04", "Martillo demoledor 15 kg", "DeWalt", "per", 19500, 960000],
  ["e05", "Amoladora 115 mm", "Black+Decker", "cor", 5200, 95000],
  ["e06", "Amoladora 230 mm", "Bosch", "cor", 8900, 230000],
  ["e07", "Sierra circular 185 mm", "Makita", "cor", 9200, 260000],
  ["e08", "Cortadora de cerámica", "Rubi", "cor", 7800, 210000],
  ["e09", "Hormigonera 130 L", "Barovo", "obr", 14500, 640000],
  ["e10", "Andamio tubular (cuerpo)", "Genérico", "obr", 4200, 150000],
  ["e11", "Andamio tubular (cuerpo)", "Genérico", "obr", 4200, 150000],
  ["e12", "Escalera extensible 7 m", "Escalumex", "obr", 5600, 190000],
  ["e13", "Generador 3,5 kVA", "Honda", "ene", 22000, 1350000],
  ["e14", "Soldadora inverter 200 A", "Lusqtoff", "ene", 9800, 280000],
  ["e15", "Hidrolavadora 1800 W", "Kärcher", "lim", 10500, 340000],
  ["e16", "Aspiradora industrial 30 L", "Gamma", "lim", 7200, 175000],
  ["e17", "Bordeadora a explosión", "Stihl", "jar", 9500, 390000],
  ["e18", "Motosierra 18\"", "Husqvarna", "jar", 13800, 520000],
];
// [id, nombre, dni/cuit, teléfono, nivel]
const CLIENTES = [
  ["c1", "Construcciones Ledesma", "30-71234567-8", "351 512-3344", "oro"],
  ["c2", "Martina Quiroga", "33.452.118", "351 640-2210", "bronce"],
  ["c3", "Hugo Barrionuevo", "25.987.004", "351 733-9081", "plata"],
  ["c4", "Refacciones del Sur", "30-70988123-1", "351 455-7702", "plata"],
  ["c5", "Lucía Ferreyra", "38.112.540", "351 298-6630", "bronce"],
  ["c6", "Pinturería Arco Iris", "30-71555098-4", "351 381-4412", "oro"],
];
