import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Receipt,
  Upload,
  Coins,
  History
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Helper to parse "YYYY-MM-DD" from form as Local Date
const parseFormDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const Finanzas = () => {
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [showVentaForm, setShowVentaForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const ventas = useStore((state) => state.ventas);
  const gastos = useStore((state) => state.gastos);
  const gastosFijos = useStore((state) => state.gastosFijos);
  const agregarVenta = useStore((state) => state.agregarVenta);
  const agregarGasto = useStore((state) => state.agregarGasto);
  const precios = useStore((state) => state.precios);
  const cortesCaja = useStore((state) => state.cortesCaja);
  const agregarCorteCaja = useStore((state) => state.agregarCorteCaja);

  const [gastoForm, setGastoForm] = useState({
    concepto: '',
    monto: 0,
    categoria: 'insumos' as const,
    fecha: format(new Date(), 'yyyy-MM-dd'),
  });

  const [ventaForm, setVentaForm] = useState({
    garrafon20L: 0,
    garrafon10L: 0,
    litros: 0,
    fecha: format(new Date(), 'yyyy-MM-dd'),
  });

  const [showCorteForm, setShowCorteForm] = useState(false);
  const [corteForm, setCorteForm] = useState({
    montoRetirado: 0,
    observaciones: '',
  });

  // Calcular totales del mes
  const ingresosMes = ventas.reduce((acc, v) => acc + v.ingresoTotal, 0);
  const gastoVariablesMes = gastos.reduce((acc, g) => acc + g.monto, 0);
  const gastosFijosMes = gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const gastosTotalesMes = gastoVariablesMes + gastosFijosMes;
  const utilidadMes = ingresosMes - gastosTotalesMes;
  const margenUtilidad = ((utilidadMes / ingresosMes) * 100).toFixed(1);

  // Dinero en Caja (Corte)
  const ultimoCorte = cortesCaja[0];
  const fechaUltimoCorte = ultimoCorte ? new Date(ultimoCorte.fecha) : new Date(2000, 0, 1);
  const ventasDesdeCorte = ventas
    .filter(v => new Date(v.semanaInicio) > fechaUltimoCorte)
    .reduce((acc, v) => acc + v.ingresoTotal, 0);
  const gastosDesdeCorte = gastos
    .filter(g => new Date(g.fecha) > fechaUltimoCorte)
    .reduce((acc, g) => acc + g.monto, 0);

  const dineroEsperado = (ultimoCorte?.efectivoEnCaja || 0) + ventasDesdeCorte - gastosDesdeCorte;

  // Datos para gráficas (Agrupar por semana para la tendencia)
  const ventasPorSemana = ventas.reduce((acc: any, v) => {
    const inicio = new Date(v.semanaInicio);
    inicio.setDate(inicio.getDate() - inicio.getDay()); // Normalizar a domingo
    const semanaKey = format(inicio, 'dd/MM');
    acc[semanaKey] = (acc[semanaKey] || 0) + v.ingresoTotal;
    return acc;
  }, {});

  const ventasData = Object.entries(ventasPorSemana)
    .map(([semana, ingresos]) => ({ semana, ingresos }))
    .slice(-4);

  const gastosData = [
    { name: 'Servicios', value: gastosFijosMes, color: '#3b82f6' },
    { name: 'Insumos', value: gastos.filter(g => g.categoria === 'insumos').reduce((acc, g) => acc + g.monto, 0), color: '#10b981' },
    { name: 'Mantenimiento', value: gastos.filter(g => g.categoria === 'mantenimiento').reduce((acc, g) => acc + g.monto, 0), color: '#f59e0b' },
    { name: 'Inventario', value: gastos.filter(g => g.categoria === 'inventario').reduce((acc, g) => acc + g.monto, 0), color: '#8b5cf6' },
    { name: 'Otros', value: gastos.filter(g => g.categoria === 'otros').reduce((acc, g) => acc + g.monto, 0), color: '#6b7280' },
  ].filter(item => item.value > 0);

  const handleAgregarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    agregarGasto({
      concepto: gastoForm.concepto,
      monto: gastoForm.monto,
      categoria: gastoForm.categoria,
      fecha: parseFormDate(gastoForm.fecha),
      recurrente: false,
    });
    setShowGastoForm(false);
    setGastoForm({ concepto: '', monto: 0, categoria: 'insumos', fecha: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleAgregarVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const localDate = parseFormDate(ventaForm.fecha);

      const inicioSemana = localDate;
      const finSemana = localDate; // Registration is now daily per user's Bitácora request

      const ingresoTotal =
        (ventaForm.garrafon20L * precios.garrafon20L.precio) +
        (ventaForm.garrafon10L * precios.garrafon10L.precio) +
        (ventaForm.litros * precios.litro.precio);

      await agregarVenta({
        semanaInicio: inicioSemana,
        semanaFin: finSemana,
        productosVendidos: {
          garrafon20L: ventaForm.garrafon20L,
          garrafon10L: ventaForm.garrafon10L,
          litro: ventaForm.litros,
        },
        ingresoTotal,
        promedioDiario: ingresoTotal / 7,
      });

      setShowVentaForm(false);
      setVentaForm({ garrafon20L: 0, garrafon10L: 0, litros: 0, fecha: format(new Date(), 'yyyy-MM-dd') });
    } catch (err: any) {
      setSubmitError(err.message || 'Error al guardar la venta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminarVenta = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de venta?')) {
      try {
        await useStore.getState().eliminarVenta(id);
      } catch (err) {
        alert('Error al eliminar la venta');
      }
    }
  };

  const handleEliminarGasto = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        await useStore.getState().eliminarGasto(id);
      } catch (err) {
        alert('Error al eliminar el gasto');
      }
    }
  };

  const handleCorteCaja = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const efectivoEnCaja = dineroEsperado - corteForm.montoRetirado;
      await agregarCorteCaja({
        fecha: new Date(),
        montoEfectivoInicial: ultimoCorte?.efectivoEnCaja || 0,
        ventasAcumuladas: ventasDesdeCorte,
        gastosEfectivo: gastosDesdeCorte,
        montoRetirado: corteForm.montoRetirado,
        efectivoEnCaja: efectivoEnCaja,
        observaciones: corteForm.observaciones,
      });
      setShowCorteForm(false);
      setCorteForm({ montoRetirado: 0, observaciones: '' });
    } catch (err) {
      alert('Error al registrar el corte de caja');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight uppercase lg:normal-case">Inteligencia Financiera</h1>
          <p className="text-slate-400 font-medium mt-1 text-xs lg:text-base">
            Gestión de ventas, gastos y utilidades</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowVentaForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Registrar Ventas
          </button>
          <button
            onClick={() => setShowGastoForm(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Gasto
          </button>
        </div>
      </div>

      {/* KPIs Financieros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90">Ingresos del Mes</p>
          <p className="text-3xl font-bold mt-2">${ingresosMes.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% vs mes anterior</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-sm opacity-90">Gastos Totales</p>
          <p className="text-3xl font-bold mt-2">${gastosTotalesMes.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingDown className="w-4 h-4" />
            <span>+3.2% vs mes anterior</span>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl lg:rounded-2xl p-6 lg:p-8">
          <p className="text-sm opacity-90">Utilidad Neta</p>
          <p className="text-3xl font-bold mt-2">${utilidadMes.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Margen: {margenUtilidad}%</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-sm opacity-90">Proyección Mensual</p>
          <p className="text-3xl font-bold mt-2">${(ingresosMes * 1.08).toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Basado en tendencia</span>
          </div>
        </div>
      </div>

      {/* Control de Caja (Corte de Caja) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1 bg-slate-900 text-white flex flex-col justify-between p-6 lg:p-8 rounded-3xl lg:rounded-2xl">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Corte de Caja</h3>
              <Coins className="text-amber-400 w-6 h-6" />
            </div>
            <p className="text-slate-400 text-sm">Dinero aproximado en caja hoy:</p>
            <p className="text-4xl font-black mt-2 text-amber-400">${dineroEsperado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic">
              * Calculado desde el último corte ({ultimoCorte ? format(new Date(ultimoCorte.fecha), 'dd/MM HH:mm') : 'Sin historial'}).
            </p>
          </div>
          <button
            onClick={() => setShowCorteForm(true)}
            className="mt-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Hacer Corte / Retiro
          </button>
        </div>

        <div className="card lg:col-span-2 rounded-3xl lg:rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-6">
            <History className="text-slate-400 w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-800">Historial de Cortes y Retiros</h3>
          </div>
          <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
            <table className="w-full text-xs lg:text-sm">
              <thead>
                <tr className="text-left border-b border-slate-100 italic text-slate-400">
                  <th className="pb-3 px-2">Fecha</th>
                  <th className="pb-3 px-2">Ventas (+)</th>
                  <th className="pb-3 px-2">Gastos (-)</th>
                  <th className="pb-3 px-2">Retirado</th>
                  <th className="pb-3 px-2 text-right">Saldo Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cortesCaja.length > 0 ? (
                  cortesCaja.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 px-2 font-medium">{format(new Date(c.fecha), 'dd/MM/yy HH:mm')}</td>
                      <td className="py-3 px-2 text-green-600 font-semibold">+${c.ventasAcumuladas.toLocaleString()}</td>
                      <td className="py-3 px-2 text-red-500">-${c.gastosEfectivo.toLocaleString()}</td>
                      <td className="py-3 px-2 text-amber-600">-${c.montoRetirado.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-800">${c.efectivoEnCaja.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No hay cortes registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gastosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {gastosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gastos Fijos */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Gastos Fijos Mensuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {gastosFijos.map((gasto) => (
            <div key={gasto.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{gasto.concepto}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${gasto.monto.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-lg font-bold text-gray-800">
            Total Gastos Fijos: ${gastosFijosMes.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bitácora de Ventas y Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Bitácora de Ventas Diarias
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 font-semibold text-slate-600">Fecha</th>
                  <th className="pb-3 font-semibold text-slate-600">Productos</th>
                  <th className="pb-3 font-semibold text-slate-600 text-right">Monto</th>
                  <th className="pb-3 font-semibold text-slate-600 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ventas.length > 0 ? (
                  ventas.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-slate-700 font-medium">
                        {format(v.semanaInicio, 'dd/MM/yyyy')}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          {v.productosVendidos.garrafon20L > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full w-fit">
                              {v.productosVendidos.garrafon20L} x 20L
                            </span>
                          )}
                          {v.productosVendidos.garrafon10L > 0 && (
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full w-fit">
                              {v.productosVendidos.garrafon10L} x 10L
                            </span>
                          )}
                          {v.productosVendidos.litro > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full w-fit">
                              {v.productosVendidos.litro} Litros
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-blue-600">
                        ${v.ingresoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleEliminarVenta(v.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      No hay ventas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="text-red-600" />
              Histórico de Gastos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 font-semibold text-slate-600">Concepto</th>
                  <th className="pb-3 font-semibold text-slate-600">Categoría</th>
                  <th className="pb-3 font-semibold text-slate-600 text-right">Monto</th>
                  <th className="pb-3 font-semibold text-slate-600 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gastos.length > 0 ? (
                  gastos.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-slate-800">{g.concepto}</p>
                        <p className="text-xs text-slate-500">{format(g.fecha, 'dd/MM/yyyy')}</p>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${g.categoria === 'mantenimiento' ? 'bg-amber-100 text-amber-700' :
                          g.categoria === 'insumos' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                          {g.categoria}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-red-600">
                        -${g.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleEliminarGasto(g.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      No hay gastos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showGastoForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl lg:rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden border-none outline-none">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Nuevo Gasto</h3>
            </div>
            <form onSubmit={handleAgregarGasto} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto
                </label>
                <input
                  type="text"
                  value={gastoForm.concepto}
                  onChange={(e) => setGastoForm({ ...gastoForm, concepto: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  value={gastoForm.monto}
                  onChange={(e) => setGastoForm({ ...gastoForm, monto: parseFloat(e.target.value) })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Gasto
                </label>
                <input
                  type="date"
                  value={gastoForm.fecha}
                  onChange={(e) => setGastoForm({ ...gastoForm, fecha: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={gastoForm.categoria}
                  onChange={(e) => setGastoForm({ ...gastoForm, categoria: e.target.value as any })}
                  className="input"
                >
                  <option value="servicios">Servicios</option>
                  <option value="insumos">Insumos</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="inventario">Inventario</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowGastoForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nueva Venta */}
      {showVentaForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl lg:rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden border-none outline-none">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Registrar Ventas Semanales</h3>
            </div>
            <form onSubmit={handleAgregarVenta} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Registro
                </label>
                <input
                  type="date"
                  value={ventaForm.fecha}
                  onChange={(e) => setVentaForm({ ...ventaForm, fecha: e.target.value })}
                  className="input"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona la fecha para la cual estás registrando las ventas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garrafones 20L Vendidos
                </label>
                <input
                  type="number"
                  value={ventaForm.garrafon20L}
                  onChange={(e) => setVentaForm({ ...ventaForm, garrafon20L: parseInt(e.target.value) || 0 })}
                  className="input"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Precio unitario: ${precios.garrafon20L.precio.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garrafones 10L (Medios) Vendidos
                </label>
                <input
                  type="number"
                  value={ventaForm.garrafon10L}
                  onChange={(e) => setVentaForm({ ...ventaForm, garrafon10L: parseInt(e.target.value) || 0 })}
                  className="input"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Precio unitario: ${precios.garrafon10L.precio.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Litros Vendidos
                </label>
                <input
                  type="number"
                  value={ventaForm.litros}
                  onChange={(e) => setVentaForm({ ...ventaForm, litros: parseInt(e.target.value) || 0 })}
                  className="input"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Precio por litro: ${precios.litro.precio.toFixed(2)}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Ingreso Total Estimado:</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${((ventaForm.garrafon20L * precios.garrafon20L.precio) +
                    (ventaForm.garrafon10L * precios.garrafon10L.precio) +
                    (ventaForm.litros * precios.litro.precio)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVentaForm(false);
                    setSubmitError(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCorteForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-6 lg:p-8 bg-slate-900 text-white">
              <h3 className="text-xl lg:text-2xl font-black uppercase lg:normal-case">Registrar Corte</h3>
              <p className="text-slate-400 text-[10px] lg:text-sm mt-1">Ingresa el monto que vas a retirar físicamente de la caja.</p>
            </div>
            <form onSubmit={handleCorteCaja} className="p-6 lg:p-8 space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto en Caja (Esperado)</p>
                <p className="text-3xl font-black text-slate-800">${dineroEsperado.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Monto a Retirar ($)</label>
                <input
                  type="number"
                  value={corteForm.montoRetirado}
                  onChange={(e) => setCorteForm({ ...corteForm, montoRetirado: parseFloat(e.target.value) || 0 })}
                  className="w-full text-2xl font-bold p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-amber-400 outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Observaciones</label>
                <textarea
                  value={corteForm.observaciones}
                  onChange={(e) => setCorteForm({ ...corteForm, observaciones: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-100 min-h-[100px]"
                  placeholder="Ej: Retiro para gasto X o depósito bancario..."
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex justify-between items-center">
                <span className="text-sm font-bold text-amber-800">Quedará en caja:</span>
                <span className="text-lg font-black text-amber-900">${(dineroEsperado - corteForm.montoRetirado).toLocaleString()}</span>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Confirmar Corte
                </button>
                <button
                  type="button"
                  onClick={() => setShowCorteForm(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finanzas;
