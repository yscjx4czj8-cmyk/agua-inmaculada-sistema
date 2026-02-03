import { Calendar as CalendarIcon, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const registrosMantenimiento = useStore((state) => state.registrosMantenimiento);
  const mantenimientos = useStore((state) => state.mantenimientos);

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMantenimientosPorFecha = (fecha: Date) => {
    return registrosMantenimiento
      .filter((r) => isSameDay(r.proximoMantenimiento, fecha))
      .map((r) => ({
        ...r,
        mantenimiento: mantenimientos.find((m) => m.id === r.mantenimientoId),
      }));
  };

  const mantenimientosHoy = getMantenimientosPorFecha(selectedDate);
  const todosPendientes = registrosMantenimiento.filter((r) =>
    r.proximoMantenimiento >= new Date()
  ).sort((a, b) => a.proximoMantenimiento.getTime() - b.proximoMantenimiento.getTime());

  return (
    <div className="space-y-10 pb-12">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-6 lg:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-inner">
              <CalendarIcon className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight uppercase lg:normal-case">Agenda de Mantenimientos</h1>
              <p className="text-slate-400 font-medium mt-1 text-xs lg:text-base">
                Monitoreo inteligente de ciclos operativos y preventivos.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="w-10 h-10 flex items-center justify-center bg-primary-500 rounded-full shadow-lg shadow-primary-500/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Próxima Visita</span>
              <span className="text-sm font-bold text-white">Sábado de Mantenimiento</span>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Calendario Premium */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 rounded-2xl">
                  <CalendarIcon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h3>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-slate-50 rounded-xl transition-all">
                  <span className="text-sm font-bold text-slate-400">Hoy</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] py-4">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {daysInMonth.map((day) => {
                const mantenimientosDia = getMantenimientosPorFecha(day);
                const esHoy = isToday(day);
                const seleccionado = isSameDay(day, selectedDate);
                const pasado = isBefore(day, new Date()) && !esHoy;

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative group aspect-square flex flex-col items-center justify-center rounded-[1.5rem] transition-all duration-300
                      ${seleccionado
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 scale-105 z-10'
                        : 'hover:bg-slate-50 border border-transparent'
                      }
                      ${esHoy && !seleccionado ? 'border-primary-500 ring-2 ring-primary-500/10' : ''}
                      ${pasado && !seleccionado ? 'opacity-40 grayscale-[50%]' : ''}
                    `}
                  >
                    <span className={`text-base font-bold ${seleccionado ? 'text-white' : 'text-slate-700'}`}>
                      {format(day, 'd')}
                    </span>

                    {mantenimientosDia.length > 0 && (
                      <div className="mt-2 flex gap-1 justify-center">
                        {mantenimientosDia.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${seleccionado ? 'bg-primary-400' : 'bg-primary-500'}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Active Glow Effect */}
                    {seleccionado && (
                      <div className="absolute -inset-1 bg-primary-500/20 rounded-[1.5rem] blur-lg pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leyenda Premium */}
            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Programado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vencido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Detalles */}
        <div className="space-y-8">
          <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-8 border-none ring-1 ring-slate-100/50 bg-white">
            <div className="pb-6 mb-6 border-b border-slate-50">
              <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Detalle del Día</span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-1 capitalize">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </h3>
            </div>

            {mantenimientosHoy.length > 0 ? (
              <div className="space-y-4">
                {mantenimientosHoy.map((m) => (
                  <div key={m.id} className="group relative p-6 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                    <h4 className="font-bold text-slate-800 mb-3 pr-6 group-hover:text-primary-600 transition-colors">
                      {m.mantenimiento?.nombre}
                    </h4>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100/50">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {m.mantenimiento?.tiempoEstimado} min
                      </div>
                      <div className="px-2 py-0.5 bg-primary-50 rounded-md text-[9px] font-black text-primary-600 uppercase tracking-widest">
                        Operativo
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold text-sm tracking-tight leading-relaxed">
                  Sin actividades programadas para esta fecha
                </p>
              </div>
            )}
          </div>

          {/* Banner de Productividad */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900 overflow-hidden relative group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold text-white mb-2 tracking-tight">Optimiza tu Visita</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Recuerda agrupar mantenimientos similares para maximizar la eficiencia operativa.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Mantenimientos Section */}
      <div className="card rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border-none ring-1 ring-slate-100/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <CalendarIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ciclos Preventivos Pendientes</h2>
            <p className="text-sm font-medium text-slate-400">Vista panorámica de las próximas intervenciones requeridas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todosPendientes.slice(0, 9).map((registro) => {
            const mantenimiento = mantenimientos.find((m) => m.id === registro.mantenimientoId);
            if (!mantenimiento) return null;

            const diasRestantes = Math.ceil(
              (registro.proximoMantenimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const esUrgente = diasRestantes <= 3;
            const esSemanal = diasRestantes <= 7;

            return (
              <div
                key={registro.id}
                className={`relative group p-8 rounded-[2rem] border-2 transition-all duration-300 ${esUrgente
                  ? 'bg-rose-50/30 border-rose-100 hover:bg-rose-50'
                  : esSemanal
                    ? 'bg-amber-50/30 border-amber-100 hover:bg-amber-50'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                  }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${esUrgente ? 'text-rose-500' : 'text-slate-400'}`}>
                        {esUrgente ? 'Intervención Crítica' : 'Mantenimiento Rutina'}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-slate-900 transition-colors">
                        {mantenimiento.nombre}
                      </h4>
                    </div>
                    {esUrgente && (
                      <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100/50 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CalendarIcon className="w-4 h-4 text-slate-400" />
                      {format(registro.proximoMantenimiento, "d 'de' MMMM", { locale: es })}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${esUrgente ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                        {diasRestantes === 0 ? 'Hoy' : diasRestantes === 1 ? 'Mañana' : `${diasRestantes} días`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
