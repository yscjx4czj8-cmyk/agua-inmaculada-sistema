import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Droplet, Activity, ShieldCheck, AlertCircle, X, ClipboardList, Plus, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalidadRegistro } from '../types';

const Calidad = () => {
  const [showForm, setShowForm] = useState(false);
  const registros = useStore((state) => state.registrosCalidad);
  const agregarRegistro = useStore((state) => state.agregarRegistroCalidad);

  const [formData, setFormData] = useState({
    cloroResidual: 0,
    sdt: 100,
    dureza: 'azul' as 'azul' | 'morado' | 'rojo',
    responsable: 'Soto',
    observaciones: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoRegistro: Omit<CalidadRegistro, 'id'> = {
      ...formData,
      fecha: new Date(),
      proximaMedicion: new Date(Date.now() + 4 * 60 * 60 * 1000),
    };

    agregarRegistro(nuevoRegistro);
    setShowForm(false);
    setFormData({
      cloroResidual: 0,
      sdt: 100,
      dureza: 'azul',
      responsable: 'Soto',
      observaciones: '',
    });
  };

  const getStatus = (registro: CalidadRegistro) => {
    const cloroOk = registro.cloroResidual <= 0.5;
    const sdtOk = registro.sdt >= 50 && registro.sdt <= 150;
    const durezaOk = registro.dureza === 'azul';

    if (cloroOk && sdtOk && durezaOk) return 'optimo';
    if (!cloroOk || !durezaOk) return 'critico';
    return 'atencion';
  };

  const ultimoRegistro = registros[registros.length - 1];

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-6 lg:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner">
              <Droplet className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight uppercase lg:normal-case">Control de Calidad H2O</h1>
              <p className="text-slate-400 font-medium mt-1 text-xs lg:text-base">
                Monitoreo físico-químico del agua purificada en tiempo real.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-primary-500/30 overflow-hidden flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Nueva Medición
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Parámetros Actuales - High Fidelity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: 'Cloro Residual',
            value: `${ultimoRegistro?.cloroResidual || 0} ppm`,
            sub: 'Ideal: 0 ppm',
            icon: Droplet,
            color: 'text-primary-500',
            bg: 'bg-primary-50',
            ok: (ultimoRegistro?.cloroResidual || 0) <= 0.5,
            action: 'Requiere lavado'
          },
          {
            label: 'Sólidos Totales (SDT)',
            value: `${ultimoRegistro?.sdt || 0} ppm`,
            sub: 'Rango: 50-150 ppm',
            icon: Activity,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            ok: (ultimoRegistro?.sdt || 0) >= 50 && (ultimoRegistro?.sdt || 0) <= 150,
            action: 'Fuera de rango'
          },
          {
            label: 'Dureza Total',
            value: ultimoRegistro?.dureza || 'Azul',
            sub: 'Ideal: Color Azul',
            icon: ShieldCheck,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            ok: ultimoRegistro?.dureza === 'azul',
            action: 'Regenerar'
          }
        ].map((item, idx) => (
          <div key={idx} className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50 hover:shadow-2xl transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.ok ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {item.ok ? 'En Norma' : 'Alerta'}
              </div>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
            <p className="text-4xl font-black text-slate-800 tracking-tighter mb-4">{item.value}</p>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 italic">{item.sub}</span>
              {!item.ok && (
                <span className="text-xs font-black text-rose-500 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {item.action}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formulario Modal Premium */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="p-6 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1 block">Protocolo de Laboratorio</span>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">Nueva Medición</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-6 lg:space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-2 lg:gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Cloro Residual (ppm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.cloroResidual}
                      onChange={(e) => setFormData({ ...formData, cloroResidual: parseFloat(e.target.value) })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-lg"
                      required
                    />
                    <Droplet className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">Ideal: 0 ppm. Control de eficiencia de carbón.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">SDT (ppm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.sdt}
                      onChange={(e) => setFormData({ ...formData, sdt: parseInt(e.target.value) })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-lg"
                      required
                    />
                    <Activity className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">Norma: 50-150 ppm. Control de osmosis inversa.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Test de Dureza (Colorímetro)</label>
                <div className="grid grid-cols-3 gap-6">
                  {([
                    { color: 'azul', label: 'Sin Dureza', desc: 'Saturación Óptima', hex: 'bg-blue-500' },
                    { color: 'morado', label: 'Dureza Media', desc: 'Regeneración Sugerida', hex: 'bg-purple-500' },
                    { color: 'rojo', label: 'Dureza Alta', desc: 'Crítico: Acción Inmediata', hex: 'bg-rose-500' }
                  ]).map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, dureza: item.color as any })}
                      className={`relative p-6 rounded-[2rem] border-2 transition-all group overflow-hidden ${formData.dureza === item.color
                        ? 'border-slate-800 bg-slate-800 text-white shadow-xl translate-y-[-4px]'
                        : 'border-slate-100 bg-slate-50 hover:bg-white text-slate-600'
                        }`}
                    >
                      <div className={`w-full h-12 rounded-xl mb-4 ${item.hex} shadow-lg`}></div>
                      <p className="text-sm font-black uppercase tracking-tighter leading-none mb-1">{item.label}</p>
                      <p className={`text-[9px] font-bold opacity-60`}>{item.desc}</p>

                      {formData.dureza === item.color && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Observaciones Operativas</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-600"
                  rows={3}
                  placeholder="Ej: Cambio de membranas, limpieza de filtros..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-5 bg-slate-900 hover:bg-black text-white rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10">
                  Registrar en Bitácora
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-3xl font-black uppercase tracking-widest transition-all">
                  Descartar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historial Premium Table */}
      <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-slate-100 rounded-2xl">
            <ClipboardList className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Historial de Calidad</h3>
        </div>

        <div className="overflow-x-auto -mx-6 lg:-mx-10 px-6 lg:px-10">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Fecha y Hora</th>
                <th className="text-left pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Cloro</th>
                <th className="text-left pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">SDT</th>
                <th className="text-left pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Dureza</th>
                <th className="text-left pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="text-right pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Auditado por</th>
              </tr>
            </thead>
            <tbody>
              {registros
                .slice()
                .reverse()
                .map((registro) => {
                  const status = getStatus(registro);
                  return (
                    <tr key={registro.id} className="group">
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 rounded-l-3xl transition-colors">
                        <span className="block text-sm font-bold text-slate-800">{format(registro.fecha, "dd MMM, yyyy", { locale: es })}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{format(registro.fecha, "HH:mm 'hrs'", { locale: es })}</span>
                      </td>
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                        <span className={`text-base font-black ${registro.cloroResidual <= 0.5 ? 'text-primary-600' : 'text-rose-600'}`}>
                          {registro.cloroResidual} <span className="text-[10px] opacity-70">ppm</span>
                        </span>
                      </td>
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                        <span className={`text-base font-black ${registro.sdt >= 50 && registro.sdt <= 150 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {registro.sdt} <span className="text-[10px] opacity-70">ppm</span>
                        </span>
                      </td>
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${registro.dureza === 'azul' ? 'bg-blue-500' : registro.dureza === 'morado' ? 'bg-purple-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
                          <span className="text-xs font-black uppercase text-slate-600 tracking-tight">{registro.dureza}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                        <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${status === 'optimo' ? 'bg-emerald-100 text-emerald-600' :
                          status === 'atencion' ? 'bg-amber-100 text-amber-600' :
                            'bg-rose-100 text-rose-600'
                          }`}>
                          {status}
                        </div>
                      </td>
                      <td className="py-6 px-6 bg-slate-50/50 group-hover:bg-slate-50 rounded-r-3xl text-right transition-colors">
                        <span className="text-sm font-black text-slate-800">{registro.responsable}</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calidad;
