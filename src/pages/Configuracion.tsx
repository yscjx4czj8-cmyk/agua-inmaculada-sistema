import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, DollarSign, TrendingUp, Calendar, Plus, Edit2, Trash2, Save } from 'lucide-react';
import type { GastoFijo } from '../types';

const Configuracion = () => {
  const { precios, actualizarProducto, gastosFijos, agregarGastoFijo, actualizarGastoFijo, eliminarGastoFijo } = useStore();

  const [editandoGasto, setEditandoGasto] = useState<string | null>(null);
  const [nuevoGasto, setNuevoGasto] = useState(false);
  const [formGasto, setFormGasto] = useState<Partial<GastoFijo>>({
    concepto: '',
    monto: 0,
    categoria: 'servicios',
    diaPago: 1,
  });

  const handleActualizarPrecio = (productoId: keyof typeof precios, campo: 'precio' | 'costo', valor: number) => {
    actualizarProducto(productoId, { [campo]: valor });
  };

  const handleGuardarGasto = () => {
    if (editandoGasto) {
      actualizarGastoFijo(editandoGasto, formGasto);
      setEditandoGasto(null);
    } else {
      agregarGastoFijo(formGasto as Omit<GastoFijo, 'id'>);
      setNuevoGasto(false);
    }
    setFormGasto({ concepto: '', monto: 0, categoria: 'servicios', diaPago: 1 });
  };

  const handleEditarGasto = (gasto: GastoFijo) => {
    setEditandoGasto(gasto.id);
    setFormGasto(gasto);
  };

  const handleCancelar = () => {
    setEditandoGasto(null);
    setNuevoGasto(false);
    setFormGasto({ concepto: '', monto: 0, categoria: 'servicios', diaPago: 1 });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-6 lg:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner">
              <Settings className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight uppercase lg:normal-case">Preferencias del Sistema</h1>
              <p className="text-slate-400 font-medium mt-1 text-xs lg:text-base">
                Control total sobre precios, costos operativos y estructura financiera.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold tracking-widest uppercase">Modo Administrador</span>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Product Pricing Architecture */}
      <div className="grid grid-cols-1 gap-8">
        <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary-50 rounded-2xl">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-slate-800 tracking-tight">Arquitectura de Precios</h2>
              <p className="text-[10px] lg:text-sm font-medium text-slate-400">Define los márgenes operativos para cada línea de producto</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(precios).map(([key, producto]) => (
              <div key={key} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-primary-100 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{producto.nombre}</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Precio de Venta</label>
                      <div className="relative group/input">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                        <input
                          type="number"
                          value={producto.precio}
                          onChange={(e) => handleActualizarPrecio(key as keyof typeof precios, 'precio', Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-bold text-slate-700 outline-none"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Costo de Producción</label>
                      <div className="relative group/input">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                        <input
                          type="number"
                          value={producto.costo}
                          onChange={(e) => handleActualizarPrecio(key as keyof typeof precios, 'costo', Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all font-bold text-slate-700 outline-none"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilidad Bruta</span>
                        <span className={`text-sm font-extrabold ${producto.precio - producto.costo > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ${(producto.precio - producto.costo).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margen Operativo</span>
                        <div className="px-3 py-1 bg-primary-50 rounded-lg">
                          <span className="text-xs font-extrabold text-primary-600">
                            {producto.costo > 0 ? ((producto.precio - producto.costo) / producto.costo * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Expenses Section */}
      <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gastos Fijos Mensuales</h2>
              <p className="text-sm font-medium text-slate-400">Compromisos financieros recurrentes</p>
            </div>
          </div>
          <button
            onClick={() => setNuevoGasto(true)}
            className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Nuevo Gasto
          </button>
        </div>

        {/* Modal-style inline form */}
        {(nuevoGasto || editandoGasto) && (
          <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-6 lg:p-8 mb-10 text-white animate-fade-in shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                {editandoGasto ? <Edit2 className="w-5 h-5 text-primary-400" /> : <Plus className="w-5 h-5 text-primary-400" />}
                {editandoGasto ? 'Ajustar Gasto Existente' : 'Registrar Nuevo Gasto Fijo'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Concepto / Servicio</label>
                  <input
                    type="text"
                    value={formGasto.concepto}
                    onChange={(e) => setFormGasto({ ...formGasto, concepto: e.target.value })}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all font-semibold outline-none"
                    placeholder="Ej: Renta de Local"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Monto Mensual</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      value={formGasto.monto}
                      onChange={(e) => setFormGasto({ ...formGasto, monto: Number(e.target.value) })}
                      className="w-full pl-10 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all font-semibold outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Día Límite de Pago</label>
                  <select
                    value={formGasto.diaPago || 1}
                    onChange={(e) => setFormGasto({ ...formGasto, diaPago: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all font-semibold outline-none appearance-none"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="text-slate-900">
                        Día {i + 1} del mes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={handleGuardarGasto}
                  className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2"
                  disabled={!formGasto.concepto || !formGasto.monto}
                >
                  <Save className="w-5 h-5" />
                  Confirmar Cambios
                </button>
                <button
                  onClick={handleCancelar}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        )}

        {/* Expenses Table/List */}
        <div className="space-y-5">
          {gastosFijos.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold tracking-tight text-lg">Estructura de Gastos Vacía</p>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2">Registra tus gastos operativos para calcular el punto de equilibrio de tu negocio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {gastosFijos.map((gasto) => (
                <div
                  key={gasto.id}
                  className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                      {gasto.diaPago}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg leading-none mb-2">{gasto.concepto}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">Servicios</span>
                        <span className="text-xs font-semibold text-slate-400">Pago mensual recurrente</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">
                      ${gasto.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditarGasto(gasto)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all active:scale-95"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el gasto "${gasto.concepto}"?`)) {
                            eliminarGastoFijo(gasto.id);
                          }
                        }}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Financial Summary Footer */}
        {gastosFijos.length > 0 && (
          <div className="mt-12 p-6 lg:p-8 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-primary-500/20 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">Carga Fija Mensual</span>
                  <p className="text-sm font-medium text-white/90 mt-1">Total de compromisos financieros recurrentes</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <span className="text-4xl font-black tracking-tighter">
                  ${gastosFijos.reduce((sum, g) => sum + g.monto, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Pesos Mexicanos (MXN)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;
