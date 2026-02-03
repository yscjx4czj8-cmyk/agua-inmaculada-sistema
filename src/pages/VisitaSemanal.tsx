import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2, Play, Calendar, History } from 'lucide-react';
import { format } from 'date-fns';

const parseFormDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const VisitaSemanal = () => {
  const [modoVisita, setModoVisita] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState<Date | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

  const tareasVisita = useStore((state) => state.tareasVisita);
  const completarTarea = useStore((state) => state.completarTarea);
  const generarPlanVisita = useStore((state) => state.generarPlanVisita);
  const historialVisitas = useStore((state) => state.historialVisitas);
  const guardarVisitaLog = useStore((state) => state.guardarVisitaLog);

  const [fechaVisita, setFechaVisita] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (tareasVisita.length === 0) {
      generarPlanVisita();
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (modoVisita && tiempoInicio) {
      interval = setInterval(() => {
        const segundos = Math.floor((new Date().getTime() - tiempoInicio.getTime()) / 1000);
        setTiempoTranscurrido(segundos);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modoVisita, tiempoInicio]);

  const iniciarVisita = () => {
    setModoVisita(true);
    setTiempoInicio(new Date());
  };

  const finalizarVisita = async () => {
    if (tareasCompletadas.length > 0) {
      try {
        await guardarVisitaLog({
          fecha: parseFormDate(fechaVisita),
          duracionSegundos: tiempoTranscurrido,
          tareasCompletadas: tareasCompletadas.map(t => t.titulo),
          observaciones: `Visita finalizada satisfactoriamente.`
        });
        alert('Visita guardada en la bitácora correctamente.');
      } catch (err) {
        alert('Error al guardar la visita en la base de datos.');
      }
    }
    setModoVisita(false);
    setTiempoInicio(null);
    setTiempoTranscurrido(0);
  };

  const tareasUrgentes = tareasVisita.filter((t) => t.prioridad === 'urgente' && !t.completada);
  const tareasNormales = tareasVisita.filter((t) => t.prioridad === 'normal' && !t.completada);
  const tareasCompletadas = tareasVisita.filter((t) => t.completada);

  const tiempoTotal = tareasVisita.reduce((acc, t) => acc + t.tiempoEstimado, 0);
  const progreso = tareasVisita.length > 0
    ? Math.round((tareasCompletadas.length / tareasVisita.length) * 100)
    : 0;

  const formatTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Profile Section */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-2xl transition-all duration-700 ${modoVisita ? 'bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 shadow-primary-500/20' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={`p-5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner ${modoVisita ? 'bg-primary-400/20' : 'bg-white/10'}`}>
              <ClipboardCheck className={`w-10 h-10 ${modoVisita ? 'text-primary-300' : 'text-primary-400'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Focus Mode: Visita Semanal</h1>
              <p className="text-slate-400 font-medium mt-1">
                {modoVisita ? 'Ejecutando protocolo de mantenimiento en tiempo real.' : 'Organiza y ejecuta las tareas críticas de tu planta.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {!modoVisita && (
              <div className="flex flex-col gap-1 mr-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Fecha de Visita</label>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  <input
                    type="date"
                    value={fechaVisita}
                    onChange={(e) => setFechaVisita(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold text-sm"
                  />
                </div>
              </div>
            )}
            {!modoVisita ? (
              <button
                onClick={iniciarVisita}
                className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-primary-500/30 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Play className="w-6 h-6 fill-current" />
                  Iniciar Visita
                </div>
              </button>
            ) : (
              <button
                onClick={finalizarVisita}
                className="px-8 py-4 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-[1.5rem] font-bold text-lg border-2 border-rose-500/30 transition-all shadow-xl"
              >
                Finalizar y Guardar
              </button>
            )}
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000 ${modoVisita ? 'bg-primary-400/30' : 'bg-primary-500/10'}`}></div>
      </div>

      {/* Visita Stats - Appearing only when active or summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Urgente', value: tareasUrgentes.length, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Programado', value: tareasNormales.length, icon: ClipboardCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Completado', value: tareasCompletadas.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Tiempo Plan', value: `${tiempoTotal}m`, icon: Clock, color: 'text-primary-500', bg: 'bg-primary-50' }
        ].map((stat, idx) => (
          <div key={idx} className="card rounded-[2rem] p-8 border-none ring-1 ring-slate-100/50 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
              </div>
              <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timer Display Frame */}
      {modoVisita && (
        <div className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600 shadow-2xl shadow-primary-500/20 transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-900 rounded-[2.9rem] p-10">
            <div className="flex items-center gap-10">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary-500 transition-all duration-1000" strokeDasharray={377} strokeDashoffset={377 - (377 * progreso) / 100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{progreso}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tiempo en Planta</span>
                <p className="text-6xl font-black text-white tracking-tighter mt-1 tabular-nums">{formatTiempo(tiempoTranscurrido)}</p>
              </div>
            </div>

            <div className="hidden lg:block text-right">
              <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">Eficiencia de Operación</span>
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold text-slate-300">Progreso Total de Tareas</div>
                <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${progreso}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List - Highly Visual Cards */}
      <div className="grid grid-cols-1 gap-12">
        {/* Urgente Section */}
        {tareasUrgentes.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-rose-500 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">⚠️ Prioridad Máxima ({tareasUrgentes.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tareasUrgentes.map((tarea) => (
                <div
                  key={tarea.id}
                  className="group relative p-8 bg-white rounded-[2.5rem] ring-1 ring-slate-100 hover:ring-rose-200 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10"
                >
                  <div className="flex items-start gap-6">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={tarea.completada}
                        onChange={() => completarTarea(tarea.id)}
                        className="peer w-8 h-8 opacity-0 absolute cursor-pointer z-10"
                      />
                      <div className="w-8 h-8 border-2 border-rose-200 rounded-xl peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm transform peer-checked:scale-100 scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{tarea.titulo}</h4>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">{tarea.descripcion}</p>

                      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {tarea.tiempoEstimado} min
                        </div>
                        <div className="px-3 py-1 bg-rose-50 rounded-lg text-[9px] font-black text-rose-600 uppercase tracking-widest border border-rose-100">
                          Crítico
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Programado Section */}
        {tareasNormales.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase text-amber-500">📋 Plan Programado ({tareasNormales.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tareasNormales.map((tarea) => (
                <div
                  key={tarea.id}
                  className="group relative p-8 bg-white rounded-[2rem] ring-1 ring-slate-100 hover:ring-amber-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <input
                      type="checkbox"
                      checked={tarea.completada}
                      onChange={() => completarTarea(tarea.id)}
                      className="mt-1 w-6 h-6 rounded-lg text-amber-500 border-slate-200 ring-offset-0 focus:ring-amber-500"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2 leading-tight uppercase tracking-tight">{tarea.titulo}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-6">{tarea.descripcion}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        Est. {tarea.tiempoEstimado} min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completadas Section */}
        {tareasCompletadas.length > 0 && (
          <section className="mt-10">
            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-200/50">
              <h3 className="text-xl font-black text-emerald-600 mb-8 flex items-center gap-3 uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6" />
                Historial de Protocolo Completado ({tareasCompletadas.length})
              </h3>
              <div className="flex flex-wrap gap-4">
                {tareasCompletadas.map((tarea) => (
                  <div
                    key={tarea.id}
                    className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-sm border border-emerald-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-extrabold text-slate-400 line-through">{tarea.titulo}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Bitácora de Visitas Anteriores */}
      {!modoVisita && historialVisitas.length > 0 && (
        <section className="mt-16 bg-white rounded-[3rem] p-10 ring-1 ring-slate-100 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary-50 rounded-2xl">
              <History className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Bitácora de Visitas Realizadas</h3>
              <p className="text-sm font-medium text-slate-400">Registro histórico de actividades en planta</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historialVisitas.map((visita) => (
              <div key={visita.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{format(new Date(visita.fecha), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase">
                    <Clock className="w-3 h-3" />
                    {formatTiempo(visita.duracionSegundos)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tareas Completadas</p>
                  <div className="flex flex-wrap gap-2">
                    {visita.tareasCompletadas?.slice(0, 3).map((tarea, idx) => (
                      <span key={idx} className="text-[9px] font-bold bg-white text-slate-600 px-2 py-1 rounded-lg border border-slate-200">
                        {tarea}
                      </span>
                    ))}
                    {visita.tareasCompletadas?.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400">+{visita.tareasCompletadas.length - 3} más</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default VisitaSemanal;
