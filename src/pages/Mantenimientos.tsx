import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Wrench, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import type { Mantenimiento } from '../types';

const Mantenimientos = () => {
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const mantenimientos = useStore((state) => state.mantenimientos);
  const registrosMantenimiento = useStore((state) => state.registrosMantenimiento);
  const agregarRegistro = useStore((state) => state.agregarRegistroMantenimiento);
  const actualizarPaso = useStore((state) => state.actualizarPasoMantenimiento);

  const categorias = {
    filtros: 'Filtros',
    tanques: 'Tanques',
    desinfeccion: 'Desinfección',
    medicion: 'Medición',
    limpieza: 'Limpieza',
    valvulas: 'Válvulas',
  };

  const frecuenciaColors: Record<string, string> = {
    diaria: 'bg-purple-100 text-purple-700',
    semanal: 'bg-blue-100 text-blue-700',
    mensual: 'bg-green-100 text-green-700',
    anual: 'bg-orange-100 text-orange-700',
    variable: 'bg-gray-100 text-gray-700',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mantenimientos</h1>
        <p className="text-gray-600 mt-2">
          Catálogo de mantenimientos y guías paso a paso
        </p>
      </div>

      {/* Grid de Mantenimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mantenimientos.map((mantenimiento) => {
          const ultimoRegistro = registrosMantenimiento
            .filter((r) => r.mantenimientoId === mantenimiento.id)
            .sort((a, b) => b.fechaRealizado.getTime() - a.fechaRealizado.getTime())[0];

          return (
            <div
              key={mantenimiento.id}
              className="card hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setSelectedMantenimiento(mantenimiento)}
            >
              <div className="flex items-start justify-between mb-4">
                <Wrench className="w-8 h-8 text-primary-500" />
                <span className={`text-xs px-2 py-1 rounded ${frecuenciaColors[mantenimiento.frecuencia]}`}>
                  {mantenimiento.frecuencia}
                </span>
              </div>

              <h3 className="font-bold text-gray-800 mb-2">{mantenimiento.nombre}</h3>
              <p className="text-sm text-gray-600 mb-4">{mantenimiento.descripcion}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mantenimiento.tiempoEstimado} min
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              {ultimoRegistro && (
                <div className="mt-3 text-xs text-gray-500">
                  Último: {ultimoRegistro.fechaRealizado.toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle */}
      {selectedMantenimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedMantenimiento.nombre}
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedMantenimiento.descripcion}</p>
                </div>
                <button
                  onClick={() => setSelectedMantenimiento(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Frecuencia</p>
                  <p className="font-bold text-gray-800 capitalize mt-1">
                    {selectedMantenimiento.frecuencia}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tiempo Estimado</p>
                  <p className="font-bold text-gray-800 mt-1">
                    {selectedMantenimiento.tiempoEstimado} minutos
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="font-bold text-gray-800 capitalize mt-1">
                    {categorias[selectedMantenimiento.categoria]}
                  </p>
                </div>
              </div>

              {/* Materiales */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3">📦 Materiales Necesarios</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMantenimiento.materialesNecesarios.map((material, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pasos */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">📝 Pasos a Seguir</h4>
                <div className="space-y-4">
                  {selectedMantenimiento.pasos.map((paso) => (
                    <div
                      key={paso.numero}
                      className={`p-4 rounded-lg border-2 ${
                        paso.completado
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={paso.completado || false}
                          onChange={(e) =>
                            actualizarPaso(
                              selectedMantenimiento.id,
                              paso.numero,
                              e.target.checked
                            )
                          }
                          className="mt-1 w-5 h-5 text-primary-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                              {paso.numero}
                            </span>
                            <h5 className="font-medium text-gray-800">
                              Paso {paso.numero}
                            </h5>
                          </div>
                          <p className="text-gray-700">{paso.descripcion}</p>
                          {paso.advertencia && (
                            <div className="mt-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                              <p className="text-sm text-orange-800">
                                ⚠️ <strong>IMPORTANTE:</strong> {paso.advertencia}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleCompletarMantenimiento(selectedMantenimiento.id)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Marcar como Completado
                </button>
                <button
                  onClick={() => setSelectedMantenimiento(null)}
                  className="btn-secondary flex-1"
                >
                  Cerrar
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
