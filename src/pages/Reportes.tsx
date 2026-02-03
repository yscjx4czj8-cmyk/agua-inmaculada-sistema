import { useStore } from '../store/useStore';
import { FileText, Download, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const Reportes = () => {
  const ventas = useStore((state) => state.ventas);
  const gastos = useStore((state) => state.gastos);
  const gastosFijos = useStore((state) => state.gastosFijos);
  const registrosCalidad = useStore((state) => state.registrosCalidad);
  const registrosMantenimiento = useStore((state) => state.registrosMantenimiento);
  const mantenimientos = useStore((state) => state.mantenimientos);

  // Calcular métricas
  const ingresosMes = ventas.reduce((acc, v) => acc + v.ingresoTotal, 0);
  const gastosTotales = gastos.reduce((acc, g) => acc + g.monto, 0) +
    gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const utilidad = ingresosMes - gastosTotales;

  const cumplimientoMantenimiento = Math.round(
    (registrosMantenimiento.length / mantenimientos.length) * 100
  );

  const reportes = [
    {
      id: '1',
      nombre: 'Reporte Mensual Financiero',
      descripcion: 'Estado de resultados, ingresos, gastos y utilidades del mes',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      datos: {
        Ingresos: `$${ingresosMes.toLocaleString()}`,
        Gastos: `$${gastosTotales.toLocaleString()}`,
        Utilidad: `$${utilidad.toLocaleString()}`,
        Margen: `${((utilidad / ingresosMes) * 100).toFixed(1)}%`,
      },
    },
    {
      id: '2',
      nombre: 'Cumplimiento de Mantenimientos',
      descripcion: 'Reporte de mantenimientos realizados vs programados',
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
      datos: {
        'Mantenimientos Totales': mantenimientos.length,
        'Realizados': registrosMantenimiento.length,
        'Cumplimiento': `${cumplimientoMantenimiento}%`,
        'Último': registrosMantenimiento.length > 0
          ? format(registrosMantenimiento[registrosMantenimiento.length - 1].fechaRealizado, 'dd/MM/yyyy')
          : 'N/A',
      },
    },
    {
      id: '3',
      nombre: 'Control de Calidad del Agua',
      descripcion: 'Historial de mediciones y cumplimiento de parámetros',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      datos: {
        'Mediciones Realizadas': registrosCalidad.length,
        'Última Medición': registrosCalidad.length > 0
          ? format(registrosCalidad[registrosCalidad.length - 1].fecha, 'dd/MM/yyyy HH:mm')
          : 'N/A',
        'Cloro Promedio': registrosCalidad.length > 0
          ? `${(registrosCalidad.reduce((acc, r) => acc + r.cloroResidual, 0) / registrosCalidad.length).toFixed(2)} ppm`
          : 'N/A',
        'SDT Promedio': registrosCalidad.length > 0
          ? `${Math.round(registrosCalidad.reduce((acc, r) => acc + r.sdt, 0) / registrosCalidad.length)} ppm`
          : 'N/A',
      },
    },
  ];

  const handleGenerarReporte = (reporteId: string) => {
    alert(`Generando reporte ${reporteId}... (Funcionalidad de exportación PDF en desarrollo)`);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-6 lg:p-10 text-white shadow-2xl mb-10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner">
              <FileText className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight uppercase lg:normal-case">Inteligencia de Datos</h1>
              <p className="text-slate-400 font-medium mt-1 text-xs lg:text-base">
                Genera reportes detallados de calidad, mantenimientos y finanzas.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Grid de Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reportes.map((reporte) => {
          const Icon = reporte.icon;
          return (
            <div key={reporte.id} className="card rounded-3xl lg:rounded-[2rem] p-0 overflow-hidden hover:shadow-2xl transition-all border-none ring-1 ring-slate-100">
              <div className={`bg-gradient-to-r ${reporte.color} p-6 lg:p-8 text-white`}>
                <Icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-lg lg:text-xl font-extrabold uppercase lg:normal-case">{reporte.nombre}</h3>
                <p className="text-xs lg:text-sm text-white opacity-90 mt-1">{reporte.descripcion}</p>
              </div>

              <div className="p-6 lg:p-8">
                {Object.entries(reporte.datos).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{key}:</span>
                    <span className="font-bold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleGenerarReporte(reporte.id)}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 mt-6"
              >
                <Download className="w-5 h-5" />
                Descargar PDF
              </button>
            </div>
          );
        })}
      </div>

      {/* Reporte Operativo Integral */}
      <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-xl lg:text-2xl font-black text-slate-800 uppercase lg:normal-case tracking-tight">📊 Reporte Operativo Integral</h3>
            <p className="text-slate-400 text-xs lg:text-base font-medium mt-1">Resumen completo del mes</p>
          </div>
          <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/30 flex items-center gap-3">
            <FileText className="w-5 h-5" />
            Exportar Full-Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-4">Resumen Financiero</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ingresos:</span>
                <span className="font-bold">${ingresosMes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gastos:</span>
                <span className="font-bold">${gastosTotales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span>Utilidad:</span>
                <span className="font-bold text-green-600">${utilidad.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <h4 className="font-bold text-green-900 mb-4">Operaciones</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mantenimientos:</span>
                <span className="font-bold">{cumplimientoMantenimiento}%</span>
              </div>
              <div className="flex justify-between">
                <span>Mediciones:</span>
                <span className="font-bold">{registrosCalidad.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-bold text-green-600">Óptimo</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-4">Proyecciones</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Próximo mes:</span>
                <span className="font-bold">${(ingresosMes * 1.08).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Crecimiento:</span>
                <span className="font-bold text-green-600">+8%</span>
              </div>
              <div className="flex justify-between">
                <span>Tendencia:</span>
                <span className="font-bold">Alcista</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Reportes;
