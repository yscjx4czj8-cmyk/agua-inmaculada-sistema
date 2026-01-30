// Tipos de datos principales del sistema

export interface CalidadRegistro {
  id: string;
  fecha: Date;
  cloroResidual: number; // ppm
  sdt: number; // ppm
  dureza: 'azul' | 'morado' | 'rojo';
  responsable: string;
  observaciones?: string;
  proximaMedicion: Date;
}

export interface Mantenimiento {
  id: string;
  nombre: string;
  descripcion: string;
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | 'variable';
  pasos: PasoMantenimiento[];
  materialesNecesarios: string[];
  tiempoEstimado: number; // minutos
  imagenes?: string[];
  categoria: 'filtros' | 'tanques' | 'desinfeccion' | 'medicion' | 'limpieza' | 'valvulas';
}

export interface PasoMantenimiento {
  numero: number;
  descripcion: string;
  imagen?: string;
  advertencia?: string;
  completado?: boolean;
}

export interface RegistroMantenimiento {
  id: string;
  mantenimientoId: string;
  fechaRealizado: Date;
  responsable: string;
  observaciones?: string;
  evidencias?: string[]; // URLs de fotos
  proximoMantenimiento: Date;
  duracion?: number; // minutos reales
}

export interface VentaSemanal {
  id: string;
  semanaInicio: Date;
  semanaFin: Date;
  garrafonesVendidos: number;
  ingresoTotal: number;
  promedioDiario: number;
}

export interface Gasto {
  id: string;
  fecha: Date;
  concepto: string;
  monto: number;
  categoria: 'servicios' | 'insumos' | 'mantenimiento' | 'inventario' | 'otros';
  recurrente: boolean;
  notas?: string;
}

export interface GastoFijo {
  id: string;
  concepto: string;
  monto: number;
  categoria: 'servicios';
}

export interface TareaVisita {
  id: string;
  mantenimientoId?: string;
  tipo: 'mantenimiento' | 'medicion' | 'registro' | 'revision';
  titulo: string;
  descripcion: string;
  prioridad: 'urgente' | 'normal' | 'baja';
  tiempoEstimado: number;
  completada: boolean;
  orden: number;
}

export interface Notificacion {
  id: string;
  tipo: 'alerta' | 'recordatorio' | 'info' | 'exito';
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  accion?: {
    label: string;
    ruta: string;
  };
}

export interface DashboardStats {
  ventasHoy: number;
  ventasSemana: number;
  tareasHoy: number;
  alertasActivas: number;
  ultimaMedicion: Date;
  proximaVisita: Date;
  estadoGeneral: 'optimo' | 'atencion' | 'critico';
}

export interface ConfiguracionPrecios {
  garrafon20L: number;
  garrafon10L: number;
  litro: number;
}

export interface CapituloManual {
  id: string;
  titulo: string;
  pagina: number;
  contenido: string;
  subsecciones?: {
    titulo: string;
    contenido: string;
  }[];
  imagenes?: string[];
  tags: string[];
}
