import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, Search, ChevronRight, ChevronDown, AlertTriangle, Calendar, Image as ImageIcon, Info } from 'lucide-react';

const Manual = () => {
  const [busqueda, setBusqueda] = useState('');
  const [capituloExpandido, setCapituloExpandido] = useState<string | null>(null);
  const manual = useStore((state) => state.manual);

  const toggleCapitulo = (id: string) => {
    setCapituloExpandido(capituloExpandido === id ? null : id);
  };

  const resultadosBusqueda = manual.filter((cap) => {
    const searchLower = busqueda.toLowerCase();
    return (
      cap.titulo.toLowerCase().includes(searchLower) ||
      cap.descripcion?.toLowerCase().includes(searchLower) ||
      cap.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      cap.pasos?.some((paso) => paso.descripcion.toLowerCase().includes(searchLower)) ||
      cap.advertencias?.some((adv) => adv.toLowerCase().includes(searchLower))
    );
  });

  const capitulosFiltrados = busqueda ? resultadosBusqueda : manual;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">📖 Manual de Operación Completo</h1>
        <p className="text-gray-600 mt-2">
          Guía completa de operación y mantenimiento del sistema de purificación
        </p>
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en el manual... (ej: 'cloro', 'filtro', 'retrolavado', 'ozono')"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        {busqueda && (
          <p className="mt-3 text-sm text-gray-600">
            {capitulosFiltrados.length} resultado{capitulosFiltrados.length !== 1 ? 's' : ''} encontrado{capitulosFiltrados.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Estadísticas del Manual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Total Capítulos</p>
              <p className="text-2xl font-bold">{manual.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Total Páginas</p>
              <p className="text-2xl font-bold">33</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Con Imágenes</p>
              <p className="text-2xl font-bold">{manual.filter(c => c.pasos?.some(p => p.imagen)).length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Con Advertencias</p>
              <p className="text-2xl font-bold">{manual.filter(c => c.advertencias && c.advertencias.length > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del Manual */}
      <div className="space-y-4">
        {capitulosFiltrados.map((capitulo) => (
          <div
            key={capitulo.id}
            className="card border-2 border-gray-200 hover:border-primary-300 transition-all"
          >
            {/* Encabezado del Capítulo */}
            <div
              onClick={() => toggleCapitulo(capitulo.id)}
              className="cursor-pointer flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-white bg-primary-600 px-3 py-1 rounded-full">
                    Pág. {capitulo.pagina}
                  </span>
                  {capitulo.frecuencia && (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {capitulo.frecuencia}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{capitulo.titulo}</h3>
                {capitulo.descripcion && (
                  <p className="text-gray-600 mb-3">{capitulo.descripcion}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {capitulo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                {capituloExpandido === capitulo.id ? (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>

            {/* Contenido Expandido */}
            {capituloExpandido === capitulo.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                {/* Advertencias */}
                {capitulo.advertencias && capitulo.advertencias.length > 0 && (
                  <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-orange-900 mb-2">⚠️ Advertencias Importantes</h4>
                        <ul className="space-y-1">
                          {capitulo.advertencias.map((advertencia, idx) => (
                            <li key={idx} className="text-sm text-orange-800">
                              • {advertencia}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pasos del Procedimiento */}
                {capitulo.pasos && capitulo.pasos.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-lg mb-4">
                      📋 Procedimiento Paso a Paso
                    </h4>
                    {capitulo.pasos.map((paso) => (
                      <div
                        key={paso.numero}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center">
                            {paso.numero}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">{paso.descripcion}</p>
                          {paso.imagen && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                              <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-800 italic">{paso.imagen}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tabla de contenido adicional (para capítulos con tablas) */}
                {capitulo.id === '21' && (
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 text-lg mb-4">📊 Tabla de Frecuencias de Análisis</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Tipo de Análisis</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Frecuencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr><td className="px-4 py-3 text-sm">Análisis Bacteriológico</td><td className="px-4 py-3 text-sm font-medium text-green-700">Mensual</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Análisis Fisicoquímico</td><td className="px-4 py-3 text-sm font-medium text-blue-700">Trimestral</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Verificación de Cloro Residual</td><td className="px-4 py-3 text-sm font-medium text-purple-700">Diaria</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Verificación de pH</td><td className="px-4 py-3 text-sm font-medium text-purple-700">Diaria</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Medición de SDT</td><td className="px-4 py-3 text-sm font-medium text-orange-700">Semanal</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {capitulo.id === '22' && (
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 text-lg mb-4">🔧 Tabla de Frecuencias de Mantenimiento</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Equipo/Tarea</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Frecuencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr><td className="px-4 py-3 text-sm">Retrolavado de Filtros</td><td className="px-4 py-3 text-sm font-medium text-orange-700">Semanal</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Limpieza de Tanques</td><td className="px-4 py-3 text-sm font-medium text-green-700">Mensual</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Cambio de Lámpara UV</td><td className="px-4 py-3 text-sm font-medium text-blue-700">Anual</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Regeneración de Suavizador</td><td className="px-4 py-3 text-sm font-medium text-purple-700">Según sea necesario</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Verificación de Generador de Ozono</td><td className="px-4 py-3 text-sm font-medium text-orange-700">Semanal</td></tr>
                          <tr><td className="px-4 py-3 text-sm">Desinfección General</td><td className="px-4 py-3 text-sm font-medium text-green-700">Mensual</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {busqueda && capitulosFiltrados.length === 0 && (
        <div className="card text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No se encontraron resultados para "<span className="font-bold">{busqueda}</span>"
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Intenta con otros términos como: cloro, filtro, retrolavado, ozono, UV, etc.
          </p>
        </div>
      )}

      {/* Sección de Problemas Comunes */}
      <div className="card bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">🔧 Solución de Problemas Comunes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              problema: 'El agua sale con olor o sabor a cloro',
              solucion: 'Realizar retrolavado al filtro de carbón activado. Ver capítulo de retrolavado.',
              pagina: 'Pág. 14',
            },
            {
              problema: 'Baja presión en el dispensador',
              solucion: 'Revisar presurizador, válvulas y tubería. Verificar que no haya fugas.',
              pagina: 'Pág. 5',
            },
            {
              problema: 'Agua con dureza (color morado/rojo en prueba)',
              solucion: 'Regenerar filtro suavizador con sal. Ajustar ciclo de regeneración.',
              pagina: 'Pág. 15',
            },
            {
              problema: 'SDT fuera de rango (muy alto o bajo)',
              solucion: 'Ajustar válvula de mezcla para regular proporción de agua tratada.',
              pagina: 'Pág. 9',
            },
            {
              problema: 'Agua con partículas o sedimentos',
              solucion: 'Realizar retrolavado de filtros multimedia. Limpiar tanques.',
              pagina: 'Pág. 12',
            },
            {
              problema: 'pH fuera de rango (muy ácido o alcalino)',
              solucion: 'Ajustar dosificación de químicos. Revisar filtros y válvula de mezcla.',
              pagina: 'Pág. 6',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border-2 border-orange-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <h4 className="font-bold text-gray-800">{item.problema}</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2 ml-7">✅ {item.solucion}</p>
              <span className="text-xs text-gray-500 ml-7 font-medium">{item.pagina}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consejos Generales */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Consejos Generales de Mantenimiento</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <p className="text-gray-700">
              <span className="font-bold">Mantén un calendario:</span> Registra todas las tareas de mantenimiento en la sección de Agenda para no olvidar ninguna actividad importante.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧪</span>
            <p className="text-gray-700">
              <span className="font-bold">Análisis diarios:</span> Realiza las mediciones de cloro y pH todos los días para garantizar la calidad del agua.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔧</span>
            <p className="text-gray-700">
              <span className="font-bold">Mantenimiento preventivo:</span> Es más económico prevenir que reparar. Sigue las frecuencias recomendadas para cada equipo.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <p className="text-gray-700">
              <span className="font-bold">Documenta todo:</span> Registra todos los mantenimientos y análisis en el sistema para tener un historial completo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
