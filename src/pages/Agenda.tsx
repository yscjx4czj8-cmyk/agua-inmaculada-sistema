import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';
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

  // Obtener mantenimientos por fecha
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Agenda de Mantenimientos</h1>
        <p className="text-gray-600 mt-2">Calendario inteligente con código de colores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {format(currentMonth, "MMMM 'de' yyyy", { locale: es })}
            </h3>
            <CalendarIcon className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Headers */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Días */}
            {daysInMonth.map((day) => {
              const mantenimientos = getMantenimientosPorFecha(day);
              const esHoy = isToday(day);
              const seleccionado = isSameDay(day, selectedDate);
              const pasado = isBefore(day, new Date()) && !esHoy;

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-2 rounded-lg transition-all relative
                    ${seleccionado ? 'bg-primary-500 text-white shadow-lg' : ''}
                    ${esHoy && !seleccionado ? 'border-2 border-primary-500' : ''}
                    ${!seleccionado && !esHoy ? 'hover:bg-gray-100' : ''}
                    ${pasado && !seleccionado && !esHoy ? 'text-gray-400' : 'text-gray-800'}
                  `}
                >
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  {mantenimientos.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {mantenimientos.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            seleccionado ? 'bg-white' : 'bg-orange-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Programado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Vencido</span>
            </div>
          </div>
        </div>

        {/* Detalles del Día */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {format(selectedDate, "d 'de' MMMM", { locale: es })}
          </h3>

          {mantenimientosHoy.length > 0 ? (
            <div className="space-y-3">
              {mantenimientosHoy.map((m) => (
                <div key={m.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-1">
                    {m.mantenimiento?.nombre}
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {m.mantenimiento?.tiempoEstimado} minutos
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay mantenimientos programados para este día
            </p>
          )}
        </div>
      </div>

      {/* Próximos Mantenimientos */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📅 Próximos Mantenimientos</h3>
        <div className="space-y-4">
          {todosPendientes.slice(0, 10).map((registro) => {
            const mantenimiento = mantenimientos.find((m) => m.id === registro.mantenimientoId);
            if (!mantenimiento) return null;

            const diasRestantes = Math.ceil(
              (registro.proximoMantenimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const esUrgente = diasRestantes <= 3;

            return (
              <div
                key={registro.id}
                className={`p-4 rounded-lg border-l-4 ${
                  esUrgente
                    ? 'bg-red-50 border-red-500'
                    : diasRestantes <= 7
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{mantenimiento.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(registro.proximoMantenimiento, "EEEE d 'de' MMMM, yyyy", {
                        locale: es,
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {mantenimiento.tiempoEstimado} minutos
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {esUrgente && (
                      <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        esUrgente
                          ? 'text-red-600'
                          : diasRestantes <= 7
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {diasRestantes === 0
                        ? 'HOY'
                        : diasRestantes === 1
                        ? 'MAÑANA'
                        : `${diasRestantes} días`}
                    </span>
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
