import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Wrench,
  Filter,
  Database,
  ShieldCheck,
  Activity,
  Droplets,
  Settings,
  CheckCircle,
  Clock,
  ChevronRight,
  X,
  Calendar,
  Timer,
  Package,
  ListChecks,
  Check,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Mantenimiento } from '../types';

const Mantenimientos = () => {
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const mantenimientos = useStore((state) => state.mantenimientos);
  const registrosMantenimiento = useStore((state) => state.registrosMantenimiento);
  const agregarRegistro = useStore((state) => state.agregarRegistroMantenimiento);
  const actualizarPaso = useStore((state) => state.actualizarPasoMantenimiento);

  const categorias: Record<string, { label: string; icon: any; color: string }> = {
    filtros: { label: 'Filtros', icon: Filter, color: 'text-blue-500' },
    tanques: { label: 'Tanques', icon: Database, color: 'text-indigo-500' },
    desinfeccion: { label: 'Desinfección', icon: ShieldCheck, color: 'text-emerald-500' },
    medicion: { label: 'Medición', icon: Activity, color: 'text-primary-500' },
    limpieza: { label: 'Limpieza', icon: Droplets, color: 'text-cyan-500' },
    valvulas: { label: 'Válvulas', icon: Settings, color: 'text-slate-500' },
  };

  const frecuenciaStyles: Record<string, string> = {
    diaria: 'bg-purple-50 text-purple-600 border-purple-100',
    semanal: 'bg-blue-50 text-blue-600 border-blue-100',
    mensual: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    anual: 'bg-orange-50 text-orange-600 border-orange-100',
    variable: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  const handleCompletarMantenimiento = (mantenimientoId: string) => {
    const mantenimiento = mantenimientos.find((m) => m.id === mantenimientoId);
    if (!mantenimiento) return;

    const proximaFecha = new Date();
    if (mantenimiento.frecuencia === 'semanal') proximaFecha.setDate(proximaFecha.getDate() + 7);
    else if (mantenimiento.frecuencia === 'mensual') proximaFecha.setMonth(proximaFecha.getMonth() + 1);
    else if (mantenimiento.frecuencia === 'anual') proximaFecha.setFullYear(proximaFecha.getFullYear() + 1);

    agregarRegistro({
      mantenimientoId,
      fechaRealizado: new Date(),
      responsable: 'Soto',
      proximoMantenimiento: proximaFecha,
    });

    setSelectedMantenimiento(null);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner">
              <Wrench className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Centro de Mantenimiento</h1>
              <p className="text-slate-400 font-medium mt-1">
                Protocolos detallados y guías interactivas para la operación óptima.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado Sistema</span>
              <span className="text-sm font-bold text-white">Certificado Operativo</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Grid de Mantenimientos - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mantenimientos.map((mantenimiento) => {
          const catInfo = categorias[mantenimiento.categoria] || categorias.filtros;
          const ultimoRegistro = registrosMantenimiento
            .filter((r) => r.mantenimientoId === mantenimiento.id)
            .sort((a, b) => b.fechaRealizado.getTime() - a.fechaRealizado.getTime())[0];

          return (
            <div
              key={mantenimiento.id}
              className="group relative bg-white rounded-[2.5rem] p-10 ring-1 ring-slate-100 hover:ring-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] cursor-pointer"
              onClick={() => setSelectedMantenimiento(mantenimiento)}
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-primary-50 transition-colors`}>
                  <catInfo.icon className={`w-6 h-6 ${catInfo.color}`} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${frecuenciaStyles[mantenimiento.frecuencia]}`}>
                  {mantenimiento.frecuencia}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors tracking-tight">
                {mantenimiento.nombre}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 line-clamp-2">
                {mantenimiento.descripcion}
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {mantenimiento.tiempoEstimado} min
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {ultimoRegistro && (
                <div className="absolute top-4 right-10 flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Último Servicio</span>
                  <span className="text-[10px] font-bold text-slate-500">{format(ultimoRegistro.fechaRealizado, "dd MMM", { locale: es })}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle Premium */}
      {selectedMantenimiento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary-500 rounded-3xl shadow-lg shadow-primary-500/20">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1 block">Protocolo Interactivo</span>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{selectedMantenimiento.nombre}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedMantenimiento(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto">
              {/* Info Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Frecuencia Requerida', value: selectedMantenimiento.frecuencia, icon: Calendar, color: 'text-purple-500' },
                  { label: 'Carga de Trabajo', value: `${selectedMantenimiento.tiempoEstimado} minutos`, icon: Timer, color: 'text-amber-500' },
                  { label: 'Nivel Operativo', value: categorias[selectedMantenimiento.categoria]?.label || 'General', icon: Activity, color: 'text-primary-500' }
                ].map((info, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                    <div className="flex items-center gap-3 mb-3">
                      <info.icon className={`w-4 h-4 ${info.color}`} />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{info.label}</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 capitalize">{info.value}</p>
                  </div>
                ))}
              </div>

              {/* Materiales Requirement */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Kit de Herramientas y Materiales
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedMantenimiento.materialesNecesarios.map((material, idx) => (
                    <div key={idx} className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider">
                      {material}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Steps */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Protocolo Paso a Paso
                </h4>
                <div className="space-y-4">
                  {selectedMantenimiento.pasos.map((paso) => (
                    <div
                      key={paso.numero}
                      onClick={() => actualizarPaso(selectedMantenimiento.id, paso.numero, !paso.completado)}
                      className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer ${paso.completado
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-100 bg-white hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5'
                        }`}
                    >
                      <div className="flex items-start gap-6">
                        <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${paso.completado ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 bg-slate-50 group-hover:border-primary-200'
                          }`}>
                          {paso.completado ? <Check className="w-5 h-5" /> : <span className="text-xs font-black">{paso.numero}</span>}
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-black text-lg transition-colors mb-2 ${paso.completado ? 'text-emerald-700' : 'text-slate-800 group-hover:text-primary-600'}`}>
                            Paso {paso.numero}
                          </h5>
                          <p className={`text-sm font-medium leading-relaxed ${paso.completado ? 'text-emerald-600/70' : 'text-slate-500'}`}>
                            {paso.descripcion}
                          </p>
                          {paso.advertencia && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                              <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                                {paso.advertencia}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => handleCompletarMantenimiento(selectedMantenimiento.id)}
                  className="flex-[2] py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Finalizar Mantenimiento
                </button>
                <button
                  onClick={() => setSelectedMantenimiento(null)}
                  className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mantenimientos;
