import {
  TrendingUp,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
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
} from 'recharts';

const Dashboard = () => {
  const ventas = useStore((state) => state.ventas);
  const registrosCalidad = useStore((state) => state.registrosCalidad);
  const notificaciones = useStore((state) => state.notificaciones);
  const tareasVisita = useStore((state) => state.tareasVisita);

  // Calcular estadísticas
  const ventasEstaSemanaSemana = ventas[ventas.length - 1] || { garrafonesVendidos: 0, ingresoTotal: 0 };
  const ultimaMedicion = registrosCalidad[registrosCalidad.length - 1];
  const alertasActivas = notificaciones.filter((n) => n.tipo === 'alerta' && !n.leida).length;
  const tareasPendientes = tareasVisita.filter((t) => !t.completada).length;

  // Datos para gráficas
  const ventasData = ventas.slice(-4).map((v) => ({
    semana: format(v.semanaInicio, 'dd/MM', { locale: es }),
    ventas: v.garrafonesVendidos,
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
      label: 'Ventas Esta Semana',
      value: ventasEstaSemanaSemana.garrafonesVendidos.toString(),
      subtext: `$${ventasEstaSemanaSemana.ingresoTotal.toLocaleString('es-MX')}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: '+12.5%',
    },
    {
      label: 'Última Medición',
      value: ultimaMedicion ? `${diasDesdeUltimaMedicion}d` : 'N/A',
      subtext: ultimaMedicion ? 'Parámetros OK' : 'Sin registros',
      icon: Droplets,
      color: diasDesdeUltimaMedicion > 7 ? 'text-red-600' : 'text-blue-600',
      bg: diasDesdeUltimaMedicion > 7 ? 'bg-red-50' : 'bg-blue-50',
    },
    {
      label: 'Alertas Activas',
      value: alertasActivas.toString(),
      subtext: alertasActivas > 0 ? 'Requiere atención' : 'Todo bien',
      icon: AlertTriangle,
      color: alertasActivas > 0 ? 'text-orange-600' : 'text-gray-400',
      bg: alertasActivas > 0 ? 'bg-orange-50' : 'bg-gray-50',
    },
    {
      label: 'Próxima Visita',
      value: 'Sábado',
      subtext: `${tareasPendientes} tareas pendientes`,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Estado General Banner */}
      <div
        className={`card border-l-4 ${
          estadoGeneral === 'optimo'
            ? 'border-green-500 bg-green-50'
            : estadoGeneral === 'atencion'
            ? 'border-orange-500 bg-orange-50'
            : 'border-red-500 bg-red-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Activity
              className={`w-12 h-12 ${
                estadoGeneral === 'optimo'
                  ? 'text-green-600'
                  : estadoGeneral === 'atencion'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {estadoGeneral === 'optimo'
                  ? '🟢 Sistema Operando Normalmente'
                  : estadoGeneral === 'atencion'
                  ? '🟡 Sistema Requiere Atención'
                  : '🔴 Sistema Requiere Atención Urgente'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {estadoGeneral === 'optimo'
                  ? 'Todos los parámetros dentro de rangos normales'
                  : estadoGeneral === 'atencion'
                  ? 'Algunos mantenimientos están próximos a vencer'
                  : 'Hay mantenimientos vencidos que requieren atención inmediata'}
              </p>
            </div>
          </div>
          <CheckCircle
            className={`w-8 h-8 ${
              estadoGeneral === 'optimo' ? 'text-green-500' : 'text-gray-300'
            }`}
          />
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                {stat.trend && (
                  <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className={`p-3 ${stat.bg} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Ventas */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Tendencia de Ventas</h3>
              <p className="text-sm text-gray-500">Últimas 4 semanas</p>
            </div>
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semana" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ fill: '#0891b2', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Ingresos */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Ingresos Semanales</h3>
              <p className="text-sm text-gray-500">En pesos mexicanos</p>
            </div>
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semana" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas y Próximas Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🚨 Alertas Recientes
          </h3>
          <div className="space-y-3">
            {notificaciones
              .filter((n) => !n.leida)
              .slice(0, 3)
              .map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notif.tipo === 'alerta'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-orange-50 border-orange-500'
                  }`}
                >
                  <p className="font-medium text-gray-800">{notif.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1">{notif.mensaje}</p>
                  {notif.accion && (
                    <button className="text-sm text-primary-600 font-medium mt-2 hover:underline">
                      {notif.accion.label} →
                    </button>
                  )}
                </div>
              ))}
            {notificaciones.filter((n) => !n.leida).length === 0 && (
              <p className="text-center text-gray-500 py-8">
                ✅ No hay alertas pendientes
              </p>
            )}
          </div>
        </div>

        {/* Próximas Tareas */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📋 Tareas para la Próxima Visita
          </h3>
          <div className="space-y-3">
            {tareasVisita.length > 0 ? (
              tareasVisita.slice(0, 5).map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    readOnly
                    className="mt-1 w-5 h-5 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{tarea.titulo}</p>
                    <p className="text-sm text-gray-500">{tarea.descripcion}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tarea.prioridad === 'urgente'
                          ? 'bg-red-100 text-red-700'
                          : tarea.prioridad === 'normal'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tarea.prioridad}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⏱️ {tarea.tiempoEstimado} min
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No hay tareas generadas para la próxima visita
                </p>
                <button className="btn-primary">
                  Generar Plan de Visita
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
