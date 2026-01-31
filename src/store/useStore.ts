import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { manualCompleto } from '../data/manualCompleto';
import { differenceInDays, isBefore } from 'date-fns';
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
  fetchGastosFijos: () => Promise<void>;
  actualizarGastoFijo: (id: string, updates: Partial<GastoFijo>) => Promise<void>;
  agregarGastoFijo: (gasto: Omit<GastoFijo, 'id'>) => Promise<void>;
  eliminarGastoFijo: (id: string) => Promise<void>;

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
  fetchPrecios: () => Promise<void>;
  actualizarProducto: (productoId: keyof ConfiguracionPrecios, updates: Partial<import('../types').ProductoConfig>) => Promise<void>;

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
    frecuencia: 'semanal',
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
  gastosFijos: [],
  precios: {
    garrafon20L: {
      id: 'garrafon20L',
      nombre: 'Garrafón 20L',
      precio: 0,
      costo: 0,
      unidad: 'unidad',
      activo: true,
    },
    garrafon10L: {
      id: 'garrafon10L',
      nombre: 'Garrafón 10L (Medio)',
      precio: 0,
      costo: 0,
      unidad: 'unidad',
      activo: true,
    },
    litro: {
      id: 'litro',
      nombre: 'Litro de Agua',
      precio: 0,
      costo: 0,
      unidad: 'litro',
      activo: true,
    },
  },
  tareasVisita: [],
  manual: manualCompleto,

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchRegistrosCalidad(),
        get().fetchRegistrosMantenimiento(),
        get().fetchVentas(),
        get().fetchGastos(),
        get().fetchGastosFijos(),
        get().fetchPrecios(),
        get().fetchNotificaciones(),
      ]);
    } catch (err) {
      set({ error: 'Error al cargar los datos' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRegistrosCalidad: async () => {
    try {
      const { data, error } = await supabase
        .from('registros_calidad')
        .select('*')
        .order('fecha', { ascending: false });
      if (error) throw error;
      set({ registrosCalidad: data.map(r => ({ ...r, fecha: new Date(r.fecha), proximaMedicion: new Date(r.proxima_medicion) })) });
    } catch (err: any) {
      console.error('Error fetching quality records:', err);
      set({ error: 'Error al cargar registros de calidad' });
    }
  },

  agregarRegistroCalidad: async (registro) => {
    set({ loading: true, error: null });
    try {
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

      if (error) throw error;

      if (data) {
        const nuevo = { ...data[0], fecha: new Date(data[0].fecha), proximaMedicion: new Date(data[0].proxima_medicion), cloroResidual: data[0].cloro_residual };
        set((state) => ({
          registrosCalidad: [nuevo, ...state.registrosCalidad],
          loading: false
        }));
      }
    } catch (err: any) {
      console.error('Error adding quality record:', err);
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchRegistrosMantenimiento: async () => {
    try {
      const { data, error } = await supabase
        .from('registros_mantenimiento')
        .select('*')
        .order('fecha_realizado', { ascending: false });
      if (error) throw error;
      set({ registrosMantenimiento: data.map(r => ({ ...r, fechaRealizado: new Date(r.fecha_realizado), proximoMantenimiento: new Date(r.proximo_mantenimiento), mantenimientoId: r.mantenimiento_id })) });
    } catch (err: any) {
      console.error('Error fetching maintenance records:', err);
      set({ error: 'Error al cargar registros de mantenimiento' });
    }
  },

  agregarRegistroMantenimiento: async (registro) => {
    set({ loading: true, error: null });
    try {
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

      if (error) throw error;

      if (data) {
        const nuevo = { ...data[0], fechaRealizado: new Date(data[0].fecha_realizado), proximoMantenimiento: new Date(data[0].proximo_mantenimiento), mantenimientoId: data[0].mantenimiento_id };
        set((state) => ({
          registrosMantenimiento: [nuevo, ...state.registrosMantenimiento],
          loading: false
        }));
      }
    } catch (err: any) {
      console.error('Error adding maintenance record:', err);
      set({ error: err.message, loading: false });
      throw err;
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
    if (!error) set({
      ventas: data.map(v => ({
        ...v,
        semanaInicio: new Date(v.semana_inicio),
        semanaFin: new Date(v.semana_fin),
        productosVendidos: {
          garrafon20L: v.garrafon_20l || 0,
          garrafon10L: v.garrafon_10l || 0,
          litro: v.litros || 0,
        },
        ingresoTotal: v.ingreso_total,
        promedioDiario: v.promedio_diario
      }))
    });
  },

  agregarVenta: async (venta) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ventas')
        .insert([{
          semana_inicio: venta.semanaInicio.toISOString().split('T')[0],
          semana_fin: venta.semanaFin.toISOString().split('T')[0],
          garrafones_vendidos: venta.productosVendidos.garrafon20L + venta.productosVendidos.garrafon10L,
          garrafon_20l: venta.productosVendidos.garrafon20L,
          garrafon_10l: venta.productosVendidos.garrafon10L,
          litros: venta.productosVendidos.litro,
          ingreso_total: venta.ingresoTotal,
          promedio_diario: venta.promedioDiario,
        }])
        .select();

      if (error) throw error;

      if (data) {
        const nueva = {
          ...data[0],
          semanaInicio: new Date(data[0].semana_inicio),
          semanaFin: new Date(data[0].semana_fin),
          productosVendidos: {
            garrafon20L: data[0].garrafon_20l || 0,
            garrafon10L: data[0].garrafon_10l || 0,
            litro: data[0].litros || 0,
          },
          ingresoTotal: data[0].ingreso_total,
          promedioDiario: data[0].promedio_diario
        };
        set((state) => ({
          ventas: [nueva, ...state.ventas],
          loading: false
        }));
      }
    } catch (err: any) {
      console.error('Error al agregar venta:', err);
      set({
        error: err.message || 'Error al guardar la venta en la base de datos',
        loading: false
      });
      throw err;
    }
  },

  fetchGastos: async () => {
    try {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .order('fecha', { ascending: false });
      if (error) throw error;
      set({ gastos: data.map(g => ({ ...g, fecha: new Date(g.fecha) })) });
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      set({ error: 'Error al cargar los gastos' });
    }
  },

  agregarGasto: async (gasto) => {
    set({ loading: true, error: null });
    try {
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

      if (error) throw error;

      if (data) {
        const nuevo = { ...data[0], fecha: new Date(data[0].fecha) };
        set((state) => ({
          gastos: [nuevo, ...state.gastos],
          loading: false
        }));
      }
    } catch (err: any) {
      console.error('Error al agregar gasto:', err);
      set({
        error: err.message || 'Error al guardar el gasto',
        loading: false
      });
      throw err;
    }
  },

  fetchGastosFijos: async () => {
    try {
      const { data, error } = await supabase
        .from('gastos_fijos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        set({
          gastosFijos: data.map(g => ({
            id: g.id,
            concepto: g.concepto,
            monto: g.monto,
            categoria: g.categoria,
            diaPago: g.dia_pago,
          }))
        });
      }
    } catch (err: any) {
      console.error('Error fetching fixed expenses:', err);
      set({ error: 'Error al cargar los gastos fijos' });
    }
  },

  actualizarGastoFijo: async (id, updates) => {
    const { error } = await supabase
      .from('gastos_fijos')
      .update({
        concepto: updates.concepto,
        monto: updates.monto,
        categoria: updates.categoria,
        dia_pago: updates.diaPago,
      })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        gastosFijos: state.gastosFijos.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      }));
    }
  },

  agregarGastoFijo: async (gasto) => {
    const { data, error } = await supabase
      .from('gastos_fijos')
      .insert([{
        concepto: gasto.concepto,
        monto: gasto.monto,
        categoria: gasto.categoria,
        dia_pago: gasto.diaPago,
      }])
      .select();

    if (!error && data) {
      const nuevo = {
        id: data[0].id,
        concepto: data[0].concepto,
        monto: data[0].monto,
        categoria: data[0].categoria,
        diaPago: data[0].dia_pago,
      };
      set((state) => ({
        gastosFijos: [nuevo, ...state.gastosFijos],
      }));
    }
  },

  eliminarGastoFijo: async (id) => {
    const { error } = await supabase
      .from('gastos_fijos')
      .delete()
      .eq('id', id);

    if (!error) {
      set((state) => ({
        gastosFijos: state.gastosFijos.filter((g) => g.id !== id),
      }));
    }
  },

  completarTarea: (id) => {
    set((state) => ({
      tareasVisita: state.tareasVisita.map((t) =>
        t.id === id ? { ...t, completada: true } : t
      ),
    }));
  },

  generarPlanVisita: () => {
    const { mantenimientos, registrosMantenimiento, registrosCalidad } = get();
    const hoy = new Date();
    const tareas: TareaVisita[] = [];
    let orden = 1;

    // 1. Tarea de Medición de Calidad (siempre se sugiere en la visita semanal)
    const ultimaMedicion = registrosCalidad[0];
    const necesitaMedicion = !ultimaMedicion ||
      differenceInDays(hoy, ultimaMedicion.fecha) >= 6;

    if (necesitaMedicion) {
      tareas.push({
        id: 'calidad-' + hoy.getTime(),
        tipo: 'medicion',
        titulo: 'Medición de Calidad',
        descripcion: 'Medir cloro, SDT y dureza (Recomendado semanalmente)',
        prioridad: 'urgente',
        tiempoEstimado: 15,
        completada: false,
        orden: orden++,
      });
    }

    // 2. Mantenimientos programados o vencidos
    mantenimientos.forEach((m) => {
      const ultimo = registrosMantenimiento.find((r) => r.mantenimientoId === m.id);
      let proxima = hoy;

      if (ultimo) {
        proxima = ultimo.proximoMantenimiento;
      }

      // Si el mantenimiento está vencido o toca en los próximos 2 días
      if (isBefore(proxima, hoy) || differenceInDays(proxima, hoy) <= 2) {
        tareas.push({
          id: `maint-${m.id}-${hoy.getTime()}`,
          mantenimientoId: m.id,
          tipo: 'mantenimiento',
          titulo: m.nombre,
          descripcion: m.descripcion,
          prioridad: m.frecuencia === 'diaria' || m.frecuencia === 'semanal' ? 'urgente' : 'normal',
          tiempoEstimado: m.tiempoEstimado,
          completada: false,
          orden: orden++,
        });
      }
    });

    // 3. Tarea de Registro de Ventas (obligatorio en visita semanal)
    tareas.push({
      id: 'ventas-' + hoy.getTime(),
      tipo: 'registro',
      titulo: 'Cerrar Ventas de la Semana',
      descripcion: 'Registrar el total de garrafones vendidos y recolectar ingresos',
      prioridad: 'urgente',
      tiempoEstimado: 10,
      completada: false,
      orden: orden++,
    });

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

  fetchPrecios: async () => {
    const { data, error } = await supabase
      .from('configuracion_precios')
      .select('*');

    if (!error && data) {
      const preciosActualizados = { ...get().precios };
      data.forEach(item => {
        if (preciosActualizados[item.id as keyof ConfiguracionPrecios]) {
          preciosActualizados[item.id as keyof ConfiguracionPrecios] = {
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            costo: item.costo,
            unidad: item.unidad,
            activo: item.activo,
          };
        }
      });
      set({ precios: preciosActualizados });
    }
  },

  actualizarProducto: async (productoId, updates) => {
    set({ loading: true, error: null });
    try {
      const current = get().precios[productoId];
      const { error } = await supabase
        .from('configuracion_precios')
        .upsert({
          id: productoId,
          nombre: updates.nombre || current.nombre,
          precio: updates.precio ?? current.precio,
          costo: updates.costo ?? current.costo,
          unidad: updates.unidad || current.unidad,
          activo: updates.activo ?? current.activo,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      set((state) => ({
        precios: {
          ...state.precios,
          [productoId]: { ...state.precios[productoId], ...updates },
        },
        loading: false
      }));
    } catch (err: any) {
      console.error('Error updating product:', err);
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
