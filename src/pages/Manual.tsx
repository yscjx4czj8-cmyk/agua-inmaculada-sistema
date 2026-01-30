import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, Search, ChevronRight } from 'lucide-react';

const Manual = () => {
  const [busqueda, setBusqueda] = useState('');
  const manual = useStore((state) => state.manual);

  const resultadosBusqueda = manual.filter(
    (cap) =>
      cap.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cap.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
      cap.tags.some((tag) => tag.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manual de Operación</h1>
        <p className="text-gray-600 mt-2">
          Acceso rápido a información del manual y solución de problemas
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
            placeholder="Buscar en el manual... (ej: 'cloro', 'filtro', 'retrolavado')"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Índice del Manual */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Índice del Manual
        </h3>
        <div className="space-y-3">
          {(busqueda ? resultadosBusqueda : manual).map((capitulo) => (
            <div
              key={capitulo.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      Pág. {capitulo.pagina}
                    </span>
                    <h4 className="font-bold text-gray-800">{capitulo.titulo}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{capitulo.contenido}</p>
                  <div className="flex flex-wrap gap-2">
                    {capitulo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </div>
            </div>
          ))}
        </div>

        {busqueda && resultadosBusqueda.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No se encontraron resultados para "{busqueda}"
          </p>
        )}
      </div>

      {/* Sección de Problemas Comunes */}
      <div className="card bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">🔧 Solución de Problemas Comunes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              problema: 'El agua sale con olor a cloro',
              solucion: 'Realizar retrolavado al filtro de carbón',
            },
            {
              problema: 'Baja presión en el dispensador',
              solucion: 'Revisar presurizador y válvulas',
            },
            {
              problema: 'Agua con dureza (color morado/rojo)',
              solucion: 'Regenerar filtro suavizador con sal',
            },
            {
              problema: 'SDT fuera de rango',
              solucion: 'Ajustar válvula de mezcla',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-orange-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-bold text-gray-800 mb-2">❓ {item.problema}</h4>
              <p className="text-sm text-gray-600">✅ {item.solucion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Manual;
