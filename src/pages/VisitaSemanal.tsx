import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2, Play } from 'lucide-react';

const VisitaSemanal = () => {
  const [modoVisita, setModoVisita] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState<Date | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

  const tareasVisita = useStore((state) => state.tareasVisita);
  const completarTarea = useStore((state) => state.completarTarea);
  const generarPlanVisita = useStore((state) => state.generarPlanVisita);

  useEffect(() => {
    if (tareasVisita.length === 0) {
      generarPlanVisita();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
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

  const finalizarVisita = () => {
    setModoVisita(false);
    setTiempoInicio(null);
    setTiempoTranscurrido(0);
  };

  const tareasUrgentes = tareasVisita.filter((t) => t.prioridad === 'urgente' && !t.completada);
  const tareasNormales = tareasVisita.filter((t) => t.prioridad === 'normal' && !t.completada);
  const tareasBajas = tareasVisita.filter((t) => t.prioridad === 'baja' && !t.completada);
  const tareasCompletadas = tareasVisita.filter((t) => t.completada);

  const tiempoTotal = tareasVisita.reduce((acc, t) => acc + t.tiempoEstimado, 0);
  const tiempoCompletado = tareasCompletadas.reduce((acc, t) => acc + t.tiempoEstimado, 0);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Visita Semanal</h1>
          <p className="text-gray-600 mt-2">
            Plan de tareas para tu visita del sábado
          </p>
        </div>
        {!modoVisita ? (
          <button
            onClick={iniciarVisita}
            className="btn-primary flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Iniciar Visita
          </button>
        ) : (
          <button
            onClick={finalizarVisita}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Finalizar Visita
          </button>
        )}
      </div>

      {/* Timer y Progreso */}
      {modoVisita && (
        <div className="card bg-gradient-to-r from-primary-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Visita en Progreso</p>
              <p className="text-4xl font-bold mt-2">{formatTiempo(tiempoTranscurrido)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Progreso General</p>
              <p className="text-4xl font-bold mt-2">{progreso}%</p>
            </div>
          </div>
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgente</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {tareasUrgentes.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="card border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Normal</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {tareasNormales.length}
              </p>
            </div>
            <ClipboardCheck className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="card border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {tareasCompletadas.length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {tiempoTotal}m
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      {tareasUrgentes.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            ⚠️ URGENTE ({tareasUrgentes.length})
          </h3>
          <div className="space-y-4">
            {tareasUrgentes.map((tarea) => (
              <div
                key={tarea.id}
                className="p-4 border-2 border-red-200 rounded-lg bg-red-50"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => completarTarea(tarea.id)}
                    className="mt-1 w-6 h-6 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{tarea.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tarea.descripcion}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tarea.tiempoEstimado} minutos
                      </span>
                      <span className="badge-danger">URGENTE</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tareasNormales.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📋 Programado ({tareasNormales.length})
          </h3>
          <div className="space-y-4">
            {tareasNormales.map((tarea) => (
              <div
                key={tarea.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => completarTarea(tarea.id)}
                    className="mt-1 w-6 h-6 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{tarea.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tarea.descripcion}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tarea.tiempoEstimado} minutos
                      </span>
                      <span className="badge-warning">NORMAL</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tareasBajas.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📌 Opcional ({tareasBajas.length})
          </h3>
          <div className="space-y-4">
            {tareasBajas.map((tarea) => (
              <div
                key={tarea.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => completarTarea(tarea.id)}
                    className="mt-1 w-6 h-6 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{tarea.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tarea.descripcion}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tarea.tiempoEstimado} minutos
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        BAJA PRIORIDAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tareas Completadas */}
      {tareasCompletadas.length > 0 && (
        <div className="card bg-green-50 border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            ✅ Completadas ({tareasCompletadas.length})
          </h3>
          <div className="space-y-3">
            {tareasCompletadas.map((tarea) => (
              <div
                key={tarea.id}
                className="p-4 bg-white rounded-lg border border-green-200"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 line-through">{tarea.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tarea.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen Final */}
      {modoVisita && (
        <div className="card bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <h3 className="text-xl font-bold mb-4">📊 Resumen de la Visita</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-75">Tiempo Transcurrido</p>
              <p className="text-2xl font-bold mt-1">{formatTiempo(tiempoTranscurrido)}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Tiempo Estimado Total</p>
              <p className="text-2xl font-bold mt-1">{tiempoTotal} min</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Tareas Completadas</p>
              <p className="text-2xl font-bold mt-1">
                {tareasCompletadas.length}/{tareasVisita.length}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Progreso</p>
              <p className="text-2xl font-bold mt-1">{progreso}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitaSemanal;
