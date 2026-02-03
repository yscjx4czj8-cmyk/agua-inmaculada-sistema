import {
  TrendingUp,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Activity,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const ventas = useStore((state) => state.ventas);
  const registrosCalidad = useStore((state) => state.registrosCalidad);
  const notificaciones = useStore((state) => state.notificaciones);
  const tareasVisita = useStore((state) => state.tareasVisita);

  // Calcular estadísticas
  const ventaActual = ventas[ventas.length - 1];
  const totalUnidadesActual = ventaActual
    ? (ventaActual.productosVendidos.garrafon20L + ventaActual.productosVendidos.garrafon10L)
    : 0;
  const ingresoActual = ventaActual?.ingresoTotal || 0;

  const ultimaMedicion = registrosCalidad[registrosCalidad.length - 1];
  const alertasActivas = notificaciones.filter((n) => n.tipo === 'alerta' && !n.leida).length;
  const tareasPendientes = tareasVisita.filter((t) => !t.completada).length;

  // Datos para gráficas
  const ventasData = ventas.slice(-7).map((v) => ({
    semana: format(v.semanaInicio, 'dd/MM', { locale: es }),
    ventas: v.productosVendidos.garrafon20L + v.productosVendidos.garrafon10L,
    litros: v.productosVendidos.litro,
    ingresos: v.ingresoTotal,
  }));

  const diasDesdeUltimaMedicion = ultimaMedicion
    ? differenceInDays(new Date(), ultimaMedicion.fecha)
    : 999;

  const estadoGeneral: 'optimo' | 'atencion' | 'critico' =
    alertasActivas > 2 || diasDesdeUltimaMedicion > 7 ? 'critico' :
      alertasActivas > 0 || diasDesdeUltimaMedicion > 3 ? 'atencion' : 'optimo';

  const stats = [
    {
      label: 'Ventas Semanales',
      value: totalUnidadesActual.toString(),
      subtext: 'Total Garrafones',
      detail: `$${ingresoActual.toLocaleString('es-MX')}`,
      icon: TrendingUp,
      gradient: 'from-emerald-400 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
      trend: ventaActual ? '+12.5%' : '0%',
    },
    {
      label: 'Calidad del Agua',
      value: ultimaMedicion ? `${diasDesdeUltimaMedicion}d` : 'N/A',
      subtext: 'Desde última prueba',
      detail: ultimaMedicion ? 'Parámetros OK' : 'Sin registros',
      icon: Droplets,
      gradient: diasDesdeUltimaMedicion > 7 ? 'from-rose-400 to-rose-600' : 'from-blue-400 to-blue-600',
      shadow: diasDesdeUltimaMedicion > 7 ? 'shadow-rose-500/20' : 'shadow-blue-500/20',
    },
    {
      label: 'Alertas de Sistema',
      value: alertasActivas.toString(),
      subtext: 'Problemas detectados',
      detail: alertasActivas > 0 ? 'Requiere atención' : 'Operación normal',
      icon: AlertTriangle,
      gradient: alertasActivas > 0 ? 'from-amber-400 to-amber-600' : 'from-slate-400 to-slate-600',
      shadow: alertasActivas > 0 ? 'shadow-amber-500/20' : 'shadow-slate-500/20',
    },
    {
      label: 'Cita en Agenda',
      value: 'Sábado',
      subtext: 'Próxima recolección',
      detail: `${tareasPendientes} tareas pendientes`,
      icon: Calendar,
      gradient: 'from-violet-400 to-violet-600',
      shadow: 'shadow-violet-500/20',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Dynamic Status Banner */}
      <div className={`relative overflow-hidden rounded-[2rem] p-8 ${estadoGeneral === 'optimo' ? 'bg-emerald-600' :
        estadoGeneral === 'atencion' ? 'bg-amber-500' : 'bg-rose-600'
        } text-white shadow-2xl transition-all duration-500`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
              <Activity className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {estadoGeneral === 'optimo' ? 'Sistema en Estado Óptimo' :
                  estadoGeneral === 'atencion' ? 'Atención Requerida' : 'Emergencia de Sistema'}
              </h3>
              <p className="text-white/80 font-medium mt-1">
                {estadoGeneral === 'optimo' ? 'Todos los sensores y registros operando en rangos de excelencia.' :
                  estadoGeneral === 'atencion' ? 'Se han detectado mantenimientos próximos a vencer.' :
                    'Alerta crítica: Mantenimientos vencidos detectados en la plataforma.'}
              </p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 active:scale-95">
            Ver Detalles Técnicos
          </button>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>

      {/* Modern KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-xl opacity-20"
              style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }}></div>
            <div className="relative card rounded-[2rem] p-8 border-none bg-white font-sans ring-1 ring-slate-100/50">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-4xl font-extrabold text-slate-800 tracking-tighter">{stat.value}</p>
                  {stat.value !== 'N/A' && <p className="text-sm font-bold text-slate-400">{stat.subtext.split(' ')[0]}</p>}
                </div>
                <p className="text-sm font-semibold text-slate-500 mt-2 truncate">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Data Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 card rounded-[2rem] p-8 border-none ring-1 ring-slate-100/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight text-xl">Monitor de Producción</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Comparativa de productos vendidos (Garrafones y Litros)</p>
              <p className="text-[10px] text-slate-400 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                Tip: La gráfica muestra los totales agrupados por semana para identificar tendencias de crecimiento. Cada punto representa el inicio de una semana.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <div className="w-3 h-3 bg-slate-100 rounded-full"></div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="semana"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#0891b2"
                  strokeWidth={4}
                  dot={{ fill: '#0891b2', strokeWidth: 3, r: 6, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Distribution */}
        <div className="card rounded-[2rem] p-8 border-none ring-1 ring-slate-100/50 overflow-hidden relative">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">Ingresos Consolidados</h3>
          <p className="text-sm font-medium text-slate-400 mb-8">Rendimiento semanal total</p>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasData}>
                <XAxis dataKey="semana" hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="ingresos" radius={[12, 12, 12, 12]} barSize={24}>
                  {ventasData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === ventasData.length - 1 ? '#0891b2' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acumulado Total</span>
              <span className="text-sm font-bold text-emerald-600">Actualizado</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800">${ventas.reduce((acc, v) => acc + v.ingresoTotal, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Critical Items & Operation Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Alerts */}
        <div className="card rounded-[2rem] p-8 border-none ring-1 ring-slate-100/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-rose-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Alertas del Centro de Control</h3>
          </div>
          <div className="space-y-4">
            {notificaciones
              .filter((n) => !n.leida)
              .slice(0, 3)
              .map((notif) => (
                <div
                  key={notif.id}
                  className="group p-5 rounded-2xl bg-white border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors uppercase text-xs tracking-widest">{notif.tipo}</p>
                      <p className="font-bold text-slate-800 mt-1">{notif.titulo}</p>
                      <p className="text-sm font-medium text-slate-500 mt-1.5 leading-relaxed">{notif.mensaje}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">12m ago</span>
                  </div>
                  {notif.accion && (
                    <button className="text-xs font-bold text-primary-600 mt-4 flex items-center gap-1 group/btn hover:gap-2 transition-all">
                      {notif.accion.label} <span className="transform translate-y-[1px]">→</span>
                    </button>
                  )}
                </div>
              ))}
            {notificaciones.filter((n) => !n.leida).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-slate-500 font-bold tracking-tight">Perímetro Seguro</p>
                <p className="text-xs text-slate-400 font-medium">No se detectan anomalías críticas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Operational Roadmap */}
        <div className="card rounded-[2rem] p-8 border-none ring-1 ring-slate-100/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Hoja de Operación Local</h3>
            </div>
            <button className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors">Ver Todo</button>
          </div>

          <div className="space-y-4">
            {tareasVisita.length > 0 ? (
              tareasVisita.slice(0, 5).map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${tarea.prioridad === 'urgente' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {tarea.tiempoEstimado}'
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate leading-none mb-1">{tarea.titulo}</p>
                    <p className="text-xs font-medium text-slate-400 truncate">{tarea.descripcion}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tarea.prioridad === 'urgente' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {tarea.prioridad}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold tracking-tight">Sin Tareas Programadas</p>
                <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:shadow-md transition-all">
                  Programar Visita de Servicio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
