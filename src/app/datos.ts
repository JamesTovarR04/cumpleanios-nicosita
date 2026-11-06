// ====== CONFIGURACIÓN DEL EVENTO ======
export const EVENTO = {
  festejada: 'Nicolth Daniela Castro',
  fecha: new Date(2026, 10, 9, 19, 0, 0), // lunes 9 de noviembre, 7:00 pm
  lugar: 'Calle 21 #39-36',
  barrio: 'Barrio Guaduales',
  ciudad: 'Neiva', // opcional: agrega la ciudad para mejorar el mapa, ej. 'Cali'
  whatsapp: '3224280444', // opcional: número con indicativo, ej. '573001234567'
};

export const REGALOS = [
  {
    icono: 'checkroom',
    titulo: 'Ropa y accesorios',
    detalle: 'Bolsos, bufandas, joyería delicada',
  },
  {
    icono: 'spa',
    titulo: 'Maquillaje y cuidado personal',
    detalle: 'Perfumes, cremas, sets de skincare',
  },
  {
    icono: 'menu_book',
    titulo: 'Libros',
    detalle: 'Novelas, diarios, libros de arte',
  },
  {
    icono: 'home',
    titulo: 'Detalles para el hogar',
    detalle: 'Velas aromáticas, marcos, decoración',
  },
  {
    icono: 'headphones',
    titulo: 'Tecnología',
    detalle: 'Audífonos, accesorios para el celular',
  },
  {
    icono: 'confirmation_number',
    titulo: 'Experiencias',
    detalle: 'Bonos de cine, spa o restaurantes',
  },
  {
    icono: 'local_florist',
    titulo: 'Flores y chocolates',
    detalle: 'Un detalle dulce nunca falla',
  },
  {
    icono: 'mail',
    titulo: 'Lluvia de sobres',
    detalle: 'Si prefieres, un aporte en efectivo',
  },
];

// ====== INVITADOS PERSONALIZADOS ======
// ====== INVITADOS PERSONALIZADOS ======
// Enlace: https://tu-sitio/#/ana   (usa el id como ruta)
export interface Invitado {
  nombre: string;
  sexo: 'M' | 'F'; // M = masculino, F = femenino
  cupos: number;
}

export const INVITADOS: Record<string, Invitado> = {
  ana: { nombre: 'Ana María', sexo: 'F', cupos: 2 },
  carlos: { nombre: 'Carlos', sexo: 'M', cupos: 1 },
  'familia-perez': { nombre: 'Familia Pérez', sexo: 'F', cupos: 4 },
};

// ====== COLORES SUGERIDOS PARA PAPEL Y BOLSA DE REGALO ======
export const COLORES_REGALO = [
  { nombre: 'Lila claro', hex: '#c9b8f0' },
  { nombre: 'Lavanda', hex: '#e4dcf8' },
  { nombre: 'Azul cielo', hex: '#bfe0f7' },
  { nombre: 'Azul pastel', hex: '#dceefb' },
  { nombre: 'Blanco', hex: '#ffffff' },
  { nombre: 'Plateado', hex: '#d6d9e0' },
];
