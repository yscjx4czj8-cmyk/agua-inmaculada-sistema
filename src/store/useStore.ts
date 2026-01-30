import { create } from 'zustand';
// Los imports de date-fns se comentan o eliminan si no se usan temporalmente hasta Supabase
// import { addDays, addWeeks, addMonths, subDays, subWeeks } from 'date-fns';
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
  // Calidad del Agua
  registrosCalidad: CalidadRegistro[];
  agregarRegistroCalidad: (registro: Omit<CalidadRegistro, 'id'>) => void;

  // Mantenimientos
  mantenimientos: Mantenimiento[];
  registrosMantenimiento: RegistroMantenimiento[];
  agregarRegistroMantenimiento: (registro: Omit<RegistroMantenimiento, 'id'>) => void;
  actualizarPasoMantenimiento: (mantenimientoId: string, pasoNumero: number, completado: boolean) => void;

  // Ventas
  ventas: VentaSemanal[];
  agregarVenta: (venta: Omit<VentaSemanal, 'id'>) => void;

  // Gastos
  gastos: Gasto[];
  gastosFijos: GastoFijo[];
  agregarGasto: (gasto: Omit<Gasto, 'id'>) => void;
  actualizarGastoFijo: (id: string, monto: number) => void;

  // Visita Semanal
  tareasVisita: TareaVisita[];
  completarTarea: (id: string) => void;
  generarPlanVisita: () => void;

  // Notificaciones
  notificaciones: Notificacion[];
  marcarNotificacionLeida: (id: string) => void;
  agregarNotificacion: (notificacion: Omit<Notificacion, 'id'>) => void;

  // Configuración
  precios: ConfiguracionPrecios;
  actualizarPrecios: (precios: Partial<ConfiguracionPrecios>) => void;

  // Manual
  manual: CapituloManual[];
}

// Datos de ejemplo basados en el manual
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
  {
    id: '6',
    nombre: 'Lavado y Desinfección de Tubería',
    descripcion: 'Cloración de línea del agua producto a los despachadores',
    frecuencia: 'mensual',
    categoria: 'desinfeccion',
    tiempoEstimado: 60,
    materialesNecesarios: ['Cloro comercial (Cloralex)'],
    pasos: [
      { numero: 1, descripcion: 'Llene el tanque de agua producto con 250 litros de agua y agregue 150 mL de cloro comercial' },
      { numero: 2, descripcion: 'Abra de forma manual la válvula solenoide de llenado girando la bobina en sentido ON' },
      { numero: 3, descripcion: 'Hasta percibir el olor a cloro en la espiga de llenado, cierre la válvula solenoide' },
      { numero: 4, descripcion: 'Para que haya flujo de agua por la tubería de enjuague, abra de forma manual la válvula solenoide' },
      { numero: 5, descripcion: 'Deje la tubería con cloro en reposo de 8 a 12 horas' },
      { numero: 6, descripcion: 'Llene el tanque con agua filtrada y abra nuevamente la válvula solenoide de enjuague y llenado' },
    ],
  },
  {
    id: '7',
    nombre: 'Lavado y Desinfección de Tanque',
    descripcion: 'Limpieza interna del tanque de agua producto',
    frecuencia: 'mensual',
    categoria: 'limpieza',
    tiempoEstimado: 45,
    materialesNecesarios: ['Germicida', 'Trapo de microfibra'],
    pasos: [
      { numero: 1, descripcion: 'Lave perfectamente con germicida y trapo de microfibra todas las paredes internas del tanque' },
      { numero: 2, descripcion: 'Después del lavado interno, enjuague con abundante agua y retire el agua acumulada en el tanque' },
      { numero: 3, descripcion: 'Seque con un trapo de microfibra que no deje residuos' },
      { numero: 4, descripcion: 'Verifique el nivel del cloro en el tanque de agua cruda' },
    ],
  },
  {
    id: '8',
    nombre: 'Cambio de Foco de Luz Ultravioleta',
    descripcion: 'Reemplazo de lámpara UV',
    frecuencia: 'anual',
    categoria: 'desinfeccion',
    tiempoEstimado: 30,
    materialesNecesarios: ['Foco UV nuevo'],
    pasos: [
      { numero: 1, descripcion: 'Desconecte la lámpara de la fuente de energía' },
      { numero: 2, descripcion: 'Retire con cuidado el capuchón negro del extremo' },
      { numero: 3, descripcion: 'Observe la conexión de la lámpara' },
      { numero: 4, descripcion: 'Separe el conector de los filamentos del foco UV' },
      { numero: 5, descripcion: 'Saque el foco UV de la carcasa de acero inoxidable' },
      { numero: 6, descripcion: 'Desconecte los filamentos de ambos extremos' },
      { numero: 7, descripcion: 'Coloque el nuevo foco de la misma manera que se retiró el anterior' },
    ],
  },
  {
    id: '9',
    nombre: 'Limpieza de Cuarzo',
    descripcion: 'Limpieza del cuarzo que cubre el foco UV',
    frecuencia: 'anual',
    categoria: 'limpieza',
    tiempoEstimado: 30,
    materialesNecesarios: ['Trapo de microfibra'],
    pasos: [
      { numero: 1, descripcion: 'Desconecte la lámpara UV y el presurizador de la corriente eléctrica' },
      { numero: 2, descripcion: 'Despresurice la línea girando la bobina de la válvula solenoide en sentido ON' },
      { numero: 3, descripcion: 'Retire con cuidado el capuchón negro del extremo' },
      { numero: 4, descripcion: 'Retire el foco ultravioleta y desconéctelo del balastro' },
      { numero: 5, descripcion: 'Retire las tapas roscables de la carcasa de la lámpara' },
      { numero: 6, descripcion: 'Retire los empaques que sostienen el cuarzo y retirar el mismo' },
      { numero: 7, descripcion: 'Limpie perfectamente el cuarzo con un trapo de microfibra' },
      { numero: 8, descripcion: 'Coloque nuevamente las piezas antes retiradas' },
    ],
  },
  {
    id: '10',
    nombre: 'Mantenimiento a Válvula Solenoide',
    descripcion: 'Limpieza y verificación de válvula solenoide',
    frecuencia: 'variable',
    categoria: 'valvulas',
    tiempoEstimado: 45,
    materialesNecesarios: ['Destornillador', 'Dado 3/16"', 'Agua purificada'],
    pasos: [
      { numero: 1, descripcion: 'Desconecte el equipo de la corriente eléctrica' },
      { numero: 2, descripcion: 'Cierre la válvula de paso del tanque de agua producto y despresurice la línea' },
      { numero: 3, descripcion: 'Con una matraca y un dado 3/16" desatornille los tornillos de la tapa de la válvula' },
      { numero: 4, descripcion: 'Lave con agua purificada todos los componentes que fueron retirados' },
      { numero: 5, descripcion: 'Coloque la base del diafragma y el diafragma cuidando la posición' },
      { numero: 6, descripcion: 'Estire el resorte con fuerza moderada, debe quedar a una altura de 2.5 a 3 cm' },
      { numero: 7, descripcion: 'Coloque el resorte en la posición correcta, después coloque la tapa' },
      { numero: 8, descripcion: 'Gire en sentido OFF para cerrar la válvula solenoide' },
    ],
  },
];

export const useStore = create<AppState>((set) => ({
  // Estado inicial - Calidad del Agua
  registrosCalidad: [],

  agregarRegistroCalidad: (registro) => {
    const nuevoRegistro: CalidadRegistro = {
      ...registro,
      id: Date.now().toString(),
    };
    set((state) => ({
      registrosCalidad: [...state.registrosCalidad, nuevoRegistro],
    }));
  },

  // Mantenimientos
  mantenimientos: mantenimientosIniciales,
  registrosMantenimiento: [],

  agregarRegistroMantenimiento: (registro) => {
    const nuevoRegistro: RegistroMantenimiento = {
      ...registro,
      id: Date.now().toString(),
    };
    set((state) => ({
      registrosMantenimiento: [...state.registrosMantenimiento, nuevoRegistro],
    }));
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

  // Ventas
  ventas: [],

  agregarVenta: (venta) => {
    const nuevaVenta: VentaSemanal = {
      ...venta,
      id: Date.now().toString(),
    };
    set((state) => ({
      ventas: [...state.ventas, nuevaVenta],
    }));
  },

  // Gastos
  gastos: [],

  gastosFijos: [
    { id: '1', concepto: 'Agua', monto: 800, categoria: 'servicios' },
    { id: '2', concepto: 'Luz', monto: 1200, categoria: 'servicios' },
    { id: '3', concepto: 'Internet', monto: 500, categoria: 'servicios' },
    { id: '4', concepto: 'Renta del local', monto: 3500, categoria: 'servicios' },
  ],

  agregarGasto: (gasto) => {
    const nuevoGasto: Gasto = {
      ...gasto,
      id: Date.now().toString(),
    };
    set((state) => ({
      gastos: [...state.gastos, nuevoGasto],
    }));
  },

  actualizarGastoFijo: (id, monto) => {
    set((state) => ({
      gastosFijos: state.gastosFijos.map((g) =>
        g.id === id ? { ...g, monto } : g
      ),
    }));
  },

  // Tareas de Visita
  tareasVisita: [],

  completarTarea: (id) => {
    set((state) => ({
      tareasVisita: state.tareasVisita.map((t) =>
        t.id === id ? { ...t, completada: true } : t
      ),
    }));
  },

  generarPlanVisita: () => {
    const tareas: TareaVisita[] = [
      {
        id: '1',
        tipo: 'medicion',
        titulo: 'Medición de Calidad del Agua',
        descripcion: 'Medir cloro residual, SDT y dureza',
        prioridad: 'urgente',
        tiempoEstimado: 15,
        completada: false,
        orden: 1,
      },
      {
        id: '2',
        mantenimientoId: '2',
        tipo: 'mantenimiento',
        titulo: 'Retrolavado Filtro Dual',
        descripcion: 'Realizar retrolavado semanal del filtro de arena y carbón',
        prioridad: 'urgente',
        tiempoEstimado: 10,
        completada: false,
        orden: 2,
      },
      {
        id: '3',
        mantenimientoId: '4',
        tipo: 'mantenimiento',
        titulo: 'Limpieza Filtros Pulidores',
        descripcion: 'Lavar filtros pulidores con cloro',
        prioridad: 'normal',
        tiempoEstimado: 30,
        completada: false,
        orden: 3,
      },
      {
        id: '4',
        tipo: 'registro',
        titulo: 'Registrar Ventas de la Semana',
        descripcion: 'Importar o registrar datos de ventas',
        prioridad: 'normal',
        tiempoEstimado: 5,
        completada: false,
        orden: 4,
      },
      {
        id: '5',
        tipo: 'revision',
        titulo: 'Verificar Nivel de Sal',
        descripcion: 'Revisar tanque de salmuera',
        prioridad: 'baja',
        tiempoEstimado: 5,
        completada: false,
        orden: 5,
      },
    ];

    set({ tareasVisita: tareas });
  },

  // Notificaciones
  notificaciones: [],

  marcarNotificacionLeida: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n.id === id ? { ...n, leida: true } : n
      ),
    }));
  },

  agregarNotificacion: (notificacion) => {
    const nuevaNotificacion: Notificacion = {
      ...notificacion,
      id: Date.now().toString(),
    };
    set((state) => ({
      notificaciones: [nuevaNotificacion, ...state.notificaciones],
    }));
  },

  // Configuración
  precios: {
    garrafon20L: 30,
    garrafon10L: 18,
    litro: 2,
  },

  actualizarPrecios: (precios) => {
    set((state) => ({
      precios: { ...state.precios, ...precios },
    }));
  },

  // Manual (datos básicos, se puede expandir)
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
}));
