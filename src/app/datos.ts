// ====== CONFIGURACIÓN DEL EVENTO ======
export const EVENTO = {
  festejada: 'Nicolth Daniela Castro',
  fecha: new Date(2026, 10, 9, 20, 0, 0), // lunes 9 de noviembre, 8:00 pm
  lugar: 'Calle 21 #39-36',
  barrio: 'Barrio Guaduales',
  ciudad: 'Neiva', // opcional: agrega la ciudad para mejorar el mapa, ej. 'Cali'
  whatsapp: '3224280444', // opcional: número con indicativo, ej. '573001234567'
};

// ====== MODELO DE INVITADO (se guarda en Supabase, tabla invitados) ======
export interface Invitado {
  id?: string; // uuid en Supabase
  nombre: string;
  sexo: 'M' | 'F'; // M = masculino, F = femenino
  cupos: number;
  mensaje?: string | null;
  asiste?: boolean;
  visitas?: number;
}

// ====== COLORES SUGERIDOS PARA PAPEL Y BOLSA DE REGALO ======
export const COLORES_REGALO = [
  { nombre: 'Lila claro', hex: '#c9b8f0' },
  { nombre: 'Lavanda', hex: '#e4dcf8' },
  { nombre: 'Azul cielo', hex: '#bfe0f7' },
  { nombre: 'Azul pastel', hex: '#dceefb' },
  { nombre: 'Blanco', hex: '#ffffff' },
  { nombre: 'Plateado', hex: '#d6d9e0' },
];
