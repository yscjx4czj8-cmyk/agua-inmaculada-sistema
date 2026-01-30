import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Droplets, Plus, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
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
      proximaMedicion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas después
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bitácora de Calidad del Agua</h1>
          <p className="text-gray-600 mt-2">
            Registro y monitoreo de parámetros de calidad
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Medición
        </button>
      </div>

      {/* Parámetros Actuales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cloro Residual</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {registros[registros.length - 1]?.cloroResidual || 0} ppm
              </p>
              <p className="text-sm text-gray-500 mt-1">Ideal: 0 ppm</p>
            </div>
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
          {(registros[registros.length - 1]?.cloroResidual || 0) <= 0.5 ? (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Óptimo</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Requiere retrolavado</span>
            </div>
          )}
        </div>

        <div className="card border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SDT</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {registros[registros.length - 1]?.sdt || 0} ppm
              </p>
              <p className="text-sm text-gray-500 mt-1">Rango: 50-150 ppm</p>
            </div>
            <Droplets className="w-8 h-8 text-green-500" />
          </div>
          {(() => {
            const sdt = registros[registros.length - 1]?.sdt || 0;
            const enRango = sdt >= 50 && sdt <= 150;
            return enRango ? (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">En rango normal</span>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Fuera de rango</span>
              </div>
            );
          })()}
        </div>

        <div className="card border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dureza</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 capitalize">
                {registros[registros.length - 1]?.dureza || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Ideal: Azul</p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${
                registros[registros.length - 1]?.dureza === 'azul'
                  ? 'bg-blue-500'
                  : registros[registros.length - 1]?.dureza === 'morado'
                  ? 'bg-purple-500'
                  : 'bg-red-500'
              }`}
            ></div>
          </div>
          {registros[registros.length - 1]?.dureza === 'azul' ? (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Sin dureza</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Regenerar suavizador</span>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Nueva Medición */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Nueva Medición de Calidad</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cloro Residual (ppm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cloroResidual}
                  onChange={(e) =>
                    setFormData({ ...formData, cloroResidual: parseFloat(e.target.value) })
                  }
                  className="input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ideal: 0 ppm. Si es mayor a 0, realizar retrolavado de carbón
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SDT - Sólidos Disueltos Totales (ppm)
                </label>
                <input
                  type="number"
                  value={formData.sdt}
                  onChange={(e) =>
                    setFormData({ ...formData, sdt: parseInt(e.target.value) })
                  }
                  className="input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rango normal: 50-150 ppm
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dureza del Agua
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['azul', 'morado', 'rojo'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, dureza: color })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.dureza === color
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-full h-16 rounded-lg mb-2 ${
                          color === 'azul'
                            ? 'bg-blue-500'
                            : color === 'morado'
                            ? 'bg-purple-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <p className="text-sm font-medium capitalize">{color}</p>
                      <p className="text-xs text-gray-500">
                        {color === 'azul'
                          ? 'Sin dureza ✓'
                          : 'Con dureza'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  className="input"
                  rows={3}
                  placeholder="Agrega cualquier observación relevante..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Guardar Medición
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historial de Mediciones */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Historial de Mediciones</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cloro</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">SDT</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dureza</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {registros
                .slice()
                .reverse()
                .map((registro) => {
                  const status = getStatus(registro);
                  return (
                    <tr key={registro.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        {format(registro.fecha, "dd 'de' MMMM, HH:mm", { locale: es })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-medium ${
                            registro.cloroResidual <= 0.5
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {registro.cloroResidual} ppm
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-medium ${
                            registro.sdt >= 50 && registro.sdt <= 150
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {registro.sdt} ppm
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${
                              registro.dureza === 'azul'
                                ? 'bg-blue-500'
                                : registro.dureza === 'morado'
                                ? 'bg-purple-500'
                                : 'bg-red-500'
                            }`}
                          ></div>
                          <span className="capitalize">{registro.dureza}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {status === 'optimo' ? (
                          <span className="badge-success">Óptimo</span>
                        ) : status === 'atencion' ? (
                          <span className="badge-warning">Atención</span>
                        ) : (
                          <span className="badge-danger">Crítico</span>
                        )}
                      </td>
                      <td className="py-4 px-4">{registro.responsable}</td>
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
