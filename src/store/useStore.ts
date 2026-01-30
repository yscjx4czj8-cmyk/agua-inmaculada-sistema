import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  CalidadRegistro,
  Mantenimiento,
  RegistroMantenimiento,
  VentaSemanal,
  Gasto,
  GastoFijo,
  TareaVisita,
  Notificacion,
  ConfiguracionPrecios,
  CapituloManual,
} from '../types';

interface AppState {
  // Estado de carga
  loading: boolean;
  error: string | null;

  // Calidad del Agua
  registrosCalidad: CalidadRegistro[];
  fetchRegistrosCalidad: () => Promise<void>;
  agregarRegistroCalidad: (registro: Omit<CalidadRegistro, 'id'>) => Promise<void>;

  // Mantenimientos
  mantenimientos: Mantenimiento[];
  registrosMantenimiento: RegistroMantenimiento[];
  fetchRegistrosMantenimiento: () => Promise<void>;
  agregarRegistroMantenimiento: (registro: Omit<RegistroMantenimiento, 'id'>) => Promise<void>;
  actualizarPasoMantenimiento: (mantenimientoId: string, pasoNumero: number, completado: boolean) => void;

  // Ventas
  ventas: VentaSemanal[];
  fetchVentas: () => Promise<void>;
  agregarVenta: (venta: Omit<VentaSemanal, 'id'>) => Promise<void>;

  // Gastos
  gastos: Gasto[];
  gastosFijos: GastoFijo[];
  fetchGastos: () => Promise<void>;
  agregarGasto: (gasto: Omit<Gasto, 'id'>) => Promise<void>;
  actualizarGastoFijo: (id: string, monto: number) => void;

  // Visita Semanal
  tareasVisita: TareaVisita[];
  completarTarea: (id: string) => void;
  generarPlanVisita: () => void;

  // Notificaciones
  notificaciones: Notificacion[];
  fetchNotificaciones: () => Promise<void>;
  marcarNotificacionLeida: (id: string) => Promise<void>;
  agregarNotificacion: (notificacion: Omit<Notificacion, 'id'>) => Promise<void>;

  // Configuración
  precios: ConfiguracionPrecios;
  actualizarPrecios: (precios: Partial<ConfiguracionPrecios>) => void;

  // Manual
  manual: CapituloManual[];

  // General
  fetchInitialData: () => Promise<void>;
}

const mantenimientosIniciales: Mantenimiento[] = [
  {
    id: '1',
    nombre: 'Medición de Cloro y pH',
    descripcion: 'Medición de parámetros de calidad del agua',
    frecuencia: 'diaria',
    categoria: 'medicion',
    tiempoEstimado: 10,
    materialesNecesarios: ['Kit de medición', 'Solución amarilla', 'Solución roja'],
    pasos: [
      { numero: 1, descripcion: 'Abra la válvula de muestreo del filtro de carbón y deje pasar agua durante 30 segundos' },
      { numero: 2, descripcion: 'Agregue cuatro gotas de solución amarilla y cuatro gotas de solución roja' },
      { numero: 3, descripcion: 'Tape los frascos y agite vigorosamente hasta lograr homogeneizar' },
      { numero: 4, descripcion: 'Después de unos segundos, revise la tonalidad y compárela con la escala de color' },
      { numero: 5, descripcion: 'Verifique que el nivel de cloro del agua extraída de la espiga de llenado sea igual a cero', advertencia: 'Si la lectura es mayor a 0, realice un retrolavado al filtro de carbón' },
    ],
  },
  {
    id: '2',
    nombre: 'Retrolavado de Filtro Dual (Arena y Carbón)',
    descripcion: 'Limpieza del filtro dual mediante retrolavado',
    frecuencia: 'semanal',
    categoria: 'filtros',
    tiempoEstimado: 10,
    materialesNecesarios: [],
    pasos: [
      { numero: 1, descripcion: 'Gire la palanca a la posición "Back Wash" y permanezca en esta posición por 5 minutos' },
      { numero: 2, descripcion: 'Gire la palanca a la posición "Fast Rinse" y permanezca en esta posición por 1 minuto' },
      { numero: 3, descripcion: 'Regrese la palanca a la posición inicial "Filter"' },
    ],
  },
  {
    id: '3',
    nombre: 'Cambio de Medios Filtrantes',
    descripcion: 'Reemplazo de arena y carbón activado en filtro dual',
    frecuencia: 'anual',
    categoria: 'filtros',
    tiempoEstimado: 90,
    materialesNecesarios: ['Arena filtrante', 'Carbón activado', 'Embudo'],
    pasos: [
      { numero: 1, descripcion: 'Despresurice la línea desconectando la bomba y gire la palanca del filtro a "Fast Rinse"' },
      { numero: 2, descripcion: 'Desenrosque las tuercas unión de su filtro' },
      { numero: 3, descripcion: 'Desenrosque el cabezal del filtro girando en contra de las manecillas del reloj' },
      { numero: 4, descripcion: 'Incline el filtro hasta colocarlo en posición horizontal' },
      { numero: 5, descripcion: 'Con el filtro en posición horizontal, retire el tubo con difusor' },
      { numero: 6, descripcion: 'Ya retirado el medio filtrante, regréselo a su posición normal' },
      { numero: 7, descripcion: 'Enjuague el tubo con el difusor y el interior del filtro con agua' },
      { numero: 8, descripcion: 'Introduzca el extremo del difusor al tanque' },
      { numero: 9, descripcion: 'Coloque un embudo en la boquilla del filtro y vierta el contenido de la nueva carga', advertencia: 'Cuide que el medio filtrante no entre en el tubo difusor' },
      { numero: 10, descripcion: 'Coloque nuevamente el cabezal y enrosque las tuercas unión' },
    ],
  },
  {
    id: '4',
    nombre: 'Limpieza de Filtros Pulidores',
    descripcion: 'Lavado de filtros pulidores de 1 a 5 micras',
    frecuencia: 'semanal',
    categoria: 'filtros',
    tiempoEstimado: 30,
    materialesNecesarios: ['Cubeta', 'Agua purificada', 'Cloro'],
    pasos: [
      { numero: 1, descripcion: 'Desconecte la bomba principal y abra la válvula de muestra de dureza' },
      { numero: 2, descripcion: 'Coloque una cubeta por debajo del filtro pulidor para evitar que el agua se derrame' },
      { numero: 3, descripcion: 'Introduzca la llave en forma de raqueta por debajo del portafiltro' },
      { numero: 4, descripcion: 'Sostenga el filtro colocando una mano en la base a manera de apoyo' },
      { numero: 5, descripcion: 'Retire el empaque que contiene la carcasa y asegúrese de no perderlo' },
      { numero: 6, descripcion: 'Una vez retirada la carcasa, tome con mucho cuidado el filtro que se encuentra en el interior' },
      { numero: 7, descripcion: 'Agregue 20 gotas de cloro y deje el filtro sumergido dentro del agua 15 a 20 min' },
      { numero: 8, descripcion: 'Enjuague con abundante agua purificada' },
      { numero: 9, descripcion: 'Lubrique con glicerina o vaselina los empaques' },
    ],
  },
  {
    id: '5',
    nombre: 'Regeneración del Filtro Suavizador',
    descripcion: 'Regeneración de resina catiónica del suavizador',
    frecuencia: 'variable',
    categoria: 'filtros',
    tiempoEstimado: 60,
    materialesNecesarios: ['Sal industrial', 'Kit de medición de dureza'],
    pasos: [
      { numero: 1, descripcion: 'Abra la válvula de muestreo del filtro suavizador y deje pasar agua durante 30 segundos' },
      { numero: 2, descripcion: 'Utilice el recipiente incluido en el kit de dureza y vierta agua de la válvula hasta la línea de aforo' },
      { numero: 3, descripcion: 'Agregue dos gotas de la solución número 6' },
      { numero: 4, descripcion: 'Si el agua se torna de color azul, no tiene dureza. Si se torna morado o rojo indica que contiene dureza' },
    ],
  },
];

export const useStore = create<AppState>((set, get) => ({
  loading: false,
  error: null,

  registrosCalidad: [],
  registrosMantenimiento: [],
  ventas: [],
  gastos: [],
  notificaciones: [],
  mantenimientos: mantenimientosIniciales,
  gastosFijos: [
    { id: '1', concepto: 'Agua', monto: 800, categoria: 'servicios' },
    { id: '2', concepto: 'Luz', monto: 1200, categoria: 'servicios' },
    { id: '3', concepto: 'Internet', monto: 500, categoria: 'servicios' },
    { id: '4', concepto: 'Renta del local', monto: 3500, categoria: 'servicios' },
  ],
  precios: {
    garrafon20L: 30,
    garrafon10L: 18,
    litro: 2,
  },
  tareasVisita: [],
  manual: [
    {
      id: '1',
      titulo: 'Medición de Cloro y pH',
      pagina: 6,
      contenido: 'Pasos para la toma de muestra y medición de parámetros de calidad.',
      tags: ['calidad', 'medicion', 'cloro', 'ph'],
    },
    {
      id: '2',
      titulo: 'Retrolavado de Filtro Dual',
      pagina: 7,
      contenido: 'Procedimiento de retrolavado del filtro de arena y carbón activado.',
      tags: ['filtros', 'retrolavado', 'mantenimiento'],
    },
    {
      id: '3',
      titulo: 'Filtro Suavizador',
      pagina: 12,
      contenido: 'Información sobre el filtro suavizador y regeneración de resina.',
      tags: ['suavizador', 'dureza', 'resina'],
    },
  ],

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchRegistrosCalidad(),
        get().fetchRegistrosMantenimiento(),
        get().fetchVentas(),
        get().fetchGastos(),
        get().fetchNotificaciones(),
      ]);
    } catch (err) {
      set({ error: 'Error al cargar los datos' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRegistrosCalidad: async () => {
    const { data, error } = await supabase
      .from('registros_calidad')
      .select('*')
      .order('fecha', { ascending: false });
    if (!error) set({ registrosCalidad: data.map(r => ({ ...r, fecha: new Date(r.fecha), proximaMedicion: new Date(r.proxima_medicion) })) });
  },

  agregarRegistroCalidad: async (registro) => {
    const { data, error } = await supabase
      .from('registros_calidad')
      .insert([{
        fecha: registro.fecha.toISOString(),
        cloro_residual: registro.cloroResidual,
        sdt: registro.sdt,
        dureza: registro.dureza,
        responsable: registro.responsable,
        observaciones: registro.observaciones,
        proxima_medicion: registro.proximaMedicion.toISOString(),
      }])
      .select();
    if (!error && data) {
      const nuevo = { ...data[0], fecha: new Date(data[0].fecha), proximaMedicion: new Date(data[0].proxima_medicion), cloroResidual: data[0].cloro_residual };
      set((state) => ({ registrosCalidad: [nuevo, ...state.registrosCalidad] }));
    }
  },

  fetchRegistrosMantenimiento: async () => {
    const { data, error } = await supabase
      .from('registros_mantenimiento')
      .select('*')
      .order('fecha_realizado', { ascending: false });
    if (!error) set({ registrosMantenimiento: data.map(r => ({ ...r, fechaRealizado: new Date(r.fecha_realizado), proximoMantenimiento: new Date(r.proximo_mantenimiento), mantenimientoId: r.mantenimiento_id })) });
  },

  agregarRegistroMantenimiento: async (registro) => {
    const { data, error } = await supabase
      .from('registros_mantenimiento')
      .insert([{
        mantenimiento_id: registro.mantenimientoId,
        fecha_realizado: registro.fechaRealizado.toISOString(),
        responsable: registro.responsable,
        observaciones: registro.observaciones,
        proximo_mantenimiento: registro.proximoMantenimiento.toISOString(),
        duracion: registro.duracion,
      }])
      .select();
    if (!error && data) {
      const nuevo = { ...data[0], fechaRealizado: new Date(data[0].fecha_realizado), proximoMantenimiento: new Date(data[0].proximo_mantenimiento), mantenimientoId: data[0].mantenimiento_id };
      set((state) => ({ registrosMantenimiento: [nuevo, ...state.registrosMantenimiento] }));
    }
  },

  actualizarPasoMantenimiento: (mantenimientoId, pasoNumero, completado) => {
    set((state) => ({
      mantenimientos: state.mantenimientos.map((m) =>
        m.id === mantenimientoId
          ? {
            ...m,
            pasos: m.pasos.map((p) =>
              p.numero === pasoNumero ? { ...p, completado } : p
            ),
          }
          : m
      ),
    }));
  },

  fetchVentas: async () => {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .order('semana_inicio', { ascending: false });
    if (!error) set({ ventas: data.map(v => ({ ...v, semanaInicio: new Date(v.semana_inicio), semanaFin: new Date(v.semana_fin), garrafonesVendidos: v.garrafones_vendidos, ingresoTotal: v.ingreso_total, promedioDiario: v.promedio_diario })) });
  },

  agregarVenta: async (venta) => {
    const { data, error } = await supabase
      .from('ventas')
      .insert([{
        semana_inicio: venta.semanaInicio.toISOString().split('T')[0],
        semana_fin: venta.semanaFin.toISOString().split('T')[0],
        garrafones_vendidos: venta.garrafonesVendidos,
        ingreso_total: venta.ingresoTotal,
        promedio_diario: venta.promedioDiario,
      }])
      .select();
    if (!error && data) {
      const nueva = { ...data[0], semanaInicio: new Date(data[0].semana_inicio), semanaFin: new Date(data[0].semana_fin), garrafonesVendidos: data[0].garrafones_vendidos, ingresoTotal: data[0].ingreso_total, promedioDiario: data[0].promedio_diario };
      set((state) => ({ ventas: [nueva, ...state.ventas] }));
    }
  },

  fetchGastos: async () => {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false });
    if (!error) set({ gastos: data.map(g => ({ ...g, fecha: new Date(g.fecha) })) });
  },

  agregarGasto: async (gasto) => {
    const { data, error } = await supabase
      .from('gastos')
      .insert([{
        fecha: gasto.fecha.toISOString().split('T')[0],
        concepto: gasto.concepto,
        monto: gasto.monto,
        categoria: gasto.categoria,
        recurrente: gasto.recurrente,
        notas: gasto.notas,
      }])
      .select();
    if (!error && data) {
      const nuevo = { ...data[0], fecha: new Date(data[0].fecha) };
      set((state) => ({ gastos: [nuevo, ...state.gastos] }));
    }
  },

  actualizarGastoFijo: (id, monto) => {
    set((state) => ({
      gastosFijos: state.gastosFijos.map((g) =>
        g.id === id ? { ...g, monto } : g
      ),
    }));
  },

  completarTarea: (id) => {
    set((state) => ({
      tareasVisita: state.tareasVisita.map((t) =>
        t.id === id ? { ...t, completada: true } : t
      ),
    }));
  },

  generarPlanVisita: () => {
    const tareas: TareaVisita[] = [
      { id: '1', tipo: 'medicion', titulo: 'Medición de Calidad', descripcion: 'Medir cloro, SDT y dureza', prioridad: 'urgente', tiempoEstimado: 15, completada: false, orden: 1 },
      { id: '2', mantenimientoId: '2', tipo: 'mantenimiento', titulo: 'Retrolavado Filtro Dual', descripcion: 'Retrolavado semanal de arena y carbón', prioridad: 'urgente', tiempoEstimado: 10, completada: false, orden: 2 },
      { id: '3', mantenimientoId: '4', tipo: 'mantenimiento', titulo: 'Limpieza Filtros Pulidores', descripcion: 'Lavar filtros con cloro', prioridad: 'normal', tiempoEstimado: 30, completada: false, orden: 3 },
      { id: '4', tipo: 'registro', titulo: 'Registrar Ventas', descripcion: 'Registrar ventas de la semana', prioridad: 'normal', tiempoEstimado: 5, completada: false, orden: 4 },
      { id: '5', tipo: 'revision', titulo: 'Verificar Sal', descripcion: 'Revisar tanque de salmuera', prioridad: 'baja', tiempoEstimado: 5, completada: false, orden: 5 },
    ];
    set({ tareasVisita: tareas });
  },

  fetchNotificaciones: async () => {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('fecha', { ascending: false });
    if (!error) set({ notificaciones: data.map(n => ({ ...n, fecha: new Date(n.fecha), accion: n.ruta_accion ? { label: 'Ver', ruta: n.ruta_accion } : undefined })) });
  },

  marcarNotificacionLeida: async (id) => {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id);
    if (!error) {
      set((state) => ({
        notificaciones: state.notificaciones.map((n) =>
          n.id === id ? { ...n, leida: true } : n
        ),
      }));
    }
  },

  agregarNotificacion: async (notificacion) => {
    const { data, error } = await supabase
      .from('notificaciones')
      .insert([{
        tipo: notificacion.tipo,
        titulo: notificacion.titulo,
        mensaje: notificacion.mensaje,
        fecha: notificacion.fecha.toISOString(),
        ruta_accion: notificacion.accion?.ruta,
      }])
      .select();
    if (!error && data) {
      const nueva = { ...data[0], fecha: new Date(data[0].fecha), accion: data[0].ruta_accion ? { label: 'Ver', ruta: data[0].ruta_accion } : undefined };
      set((state) => ({ notificaciones: [nueva, ...state.notificaciones] }));
    }
  },

  actualizarPrecios: (precios) => {
    set((state) => ({ precios: { ...state.precios, ...precios } }));
  },
}));
