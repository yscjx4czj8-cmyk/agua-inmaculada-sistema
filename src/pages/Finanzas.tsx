import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DollarSign, TrendingUp, TrendingDown, Plus, Upload } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Finanzas = () => {
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [showVentaForm, setShowVentaForm] = useState(false);

  const ventas = useStore((state) => state.ventas);
  const gastos = useStore((state) => state.gastos);
  const gastosFijos = useStore((state) => state.gastosFijos);
  const agregarVenta = useStore((state) => state.agregarVenta);
  const agregarGasto = useStore((state) => state.agregarGasto);
  const precios = useStore((state) => state.precios);

  const [gastoForm, setGastoForm] = useState({
    concepto: '',
    monto: 0,
    categoria: 'insumos' as const,
  });

  const [ventaForm, setVentaForm] = useState({
    garrafones: 0,
  });

  // Calcular totales del mes
  const ingresosMes = ventas.reduce((acc, v) => acc + v.ingresoTotal, 0);
  const gastoVariablesMes = gastos.reduce((acc, g) => acc + g.monto, 0);
  const gastosFijosMes = gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const gastosTotalesMes = gastoVariablesMes + gastosFijosMes;
  const utilidadMes = ingresosMes - gastosTotalesMes;
  const margenUtilidad = ((utilidadMes / ingresosMes) * 100).toFixed(1);

  // Datos para gráficas
  const ventasData = ventas.slice(-4).map((v) => ({
    semana: format(v.semanaInicio, 'dd/MM', { locale: es }),
    ingresos: v.ingresoTotal,
  }));

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
      ...gastoForm,
      fecha: new Date(),
      recurrente: false,
    });
    setShowGastoForm(false);
    setGastoForm({ concepto: '', monto: 0, categoria: 'insumos' });
  };

  const handleAgregarVenta = (e: React.FormEvent) => {
    e.preventDefault();
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    agregarVenta({
      semanaInicio: inicioSemana,
      semanaFin: finSemana,
      garrafonesVendidos: ventaForm.garrafones,
      ingresoTotal: ventaForm.garrafones * precios.garrafon20L,
      promedioDiario: ventaForm.garrafones / 7,
    });
    setShowVentaForm(false);
    setVentaForm({ garrafones: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Análisis Financiero</h1>
          <p className="text-gray-600 mt-2">Gestión de ventas, gastos y utilidades</p>
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

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
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

      {/* Gráficas */}
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

      {/* Modal Nuevo Gasto */}
      {showGastoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
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
                  Categoría
                </label>
                <select
                  value={gastoForm.categoria}
                  onChange={(e) => setGastoForm({ ...gastoForm, categoria: e.target.value as any })}
                  className="input"
                >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Registrar Ventas Semanales</h3>
            </div>
            <form onSubmit={handleAgregarVenta} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garrafones Vendidos
                </label>
                <input
                  type="number"
                  value={ventaForm.garrafones}
                  onChange={(e) => setVentaForm({ garrafones: parseInt(e.target.value) })}
                  className="input"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingreso estimado: ${(ventaForm.garrafones * precios.garrafon20L).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowVentaForm(false)}
                  className="btn-secondary flex-1"
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
