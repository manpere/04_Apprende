import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Estadisticas() {
  const { temas, resetearProgreso } = useContext(AppContext);
  const [temaExpandido, setTemaExpandido] = useState(null);

  // Calcular estadísticas globales
  let globalAcertadas = 0, globalFalladas = 0, globalNulas = 0;
  temas.forEach(t => {
    t.preguntas.forEach(p => {
      if (p.estado === 'acertada') globalAcertadas++;
      else if (p.estado === 'fallada') globalFalladas++;
      else globalNulas++;
    });
  });

  // Función para manejar el reseteo con alerta de confirmación
  const manejarReseteo = (alcance, id, nombre) => {
    const mensaje = `¿Estás seguro de que quieres resetear ${nombre}?\n\nTodas sus preguntas pasarán a estar "Sin responder".`;
    if (window.confirm(mensaje)) {
      resetearProgreso(alcance, id, null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas y Gestión</h2>

      {/* -- TARJETA GLOBAL -- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Progreso Global</h3>
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 text-center">
          <div className="bg-green-50 py-4 px-2 rounded-xl border border-green-100">
            <span className="block text-3xl md:text-5xl font-black text-green-600 mb-1">{globalAcertadas}</span>
            <span className="text-xs md:text-sm font-bold text-green-800 uppercase">Acertadas</span>
          </div>
          <div className="bg-red-50 py-4 px-2 rounded-xl border border-red-100">
            <span className="block text-3xl md:text-5xl font-black text-red-600 mb-1">{globalFalladas}</span>
            <span className="text-xs md:text-sm font-bold text-red-800 uppercase">Falladas</span>
          </div>
          <div className="bg-gray-50 py-4 px-2 rounded-xl border border-gray-200">
            <span className="block text-3xl md:text-5xl font-black text-gray-600 mb-1">{globalNulas}</span>
            <span className="text-xs md:text-sm font-bold text-gray-700 uppercase">Sin responder</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => manejarReseteo('global', null, 'TODO EL PROGRESO')}
            className="text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm flex items-center gap-2"
          >
            <span>⚠️</span> Resetear TODO el progreso
          </button>
        </div>
      </div>

      {/* -- DETALLE POR TEMAS Y APARTADOS -- */}
      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Detalle por Temas y Apartados</h3>
      <div className="space-y-4">
        {temas.map(tema => {
          // Estadísticas específicas de este tema
          let tAcertadas = 0, tFalladas = 0, tNulas = 0;
          tema.preguntas.forEach(p => {
            if (p.estado === 'acertada') tAcertadas++;
            else if (p.estado === 'fallada') tFalladas++;
            else tNulas++;
          });

          const isOpen = temaExpandido === tema.temaId;

          return (
            <div key={tema.temaId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
              
              {/* Cabecera del Tema (Clicable para desplegar apartados) */}
              <div className={`p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                <div className="flex-1 cursor-pointer w-full" onClick={() => setTemaExpandido(isOpen ? null : tema.temaId)}>
                  <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {tema.nombreTema}
                    <span className={`text-xs text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </h4>
                  <div className="flex gap-4 text-sm mt-2">
                    <span className="text-green-600 font-bold">{tAcertadas} A</span>
                    <span className="text-red-600 font-bold">{tFalladas} F</span>
                    <span className="text-gray-500 font-bold">{tNulas} SR</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => manejarReseteo('tema', tema.temaId, `el tema: ${tema.nombreTema}`)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg text-sm transition shadow-sm w-full md:w-auto"
                >
                  Resetear Tema
                </button>
              </div>

              {/* Acordeón: Detalle de los Apartados */}
              {isOpen && (
                <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-100 space-y-3">
                  <h5 className="font-black text-gray-400 text-xs uppercase tracking-widest mb-3">Apartados del tema</h5>
                  
                  {tema.apartados.map(apartado => {
                    // Estadísticas específicas de este apartado
                    let aAcertadas = 0, aFalladas = 0, aNulas = 0;
                    tema.preguntas.forEach(p => {
                      if (p.apartadoId === apartado.id) {
                        if (p.estado === 'acertada') aAcertadas++;
                        else if (p.estado === 'fallada') aFalladas++;
                        else aNulas++;
                      }
                    });

                    return (
                      <div key={apartado.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div>
                          <span className="font-bold text-gray-700">{apartado.nombre}</span>
                          <div className="flex gap-3 text-sm mt-1">
                            <span className="text-green-600 font-semibold">{aAcertadas} A</span>
                            <span className="text-red-600 font-semibold">{aFalladas} F</span>
                            <span className="text-gray-500 font-semibold">{aNulas} SR</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => manejarReseteo('apartado', apartado.id, `el apartado: ${apartado.nombre}`)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-1.5 px-3 rounded-md text-xs transition w-full md:w-auto"
                        >
                          Resetear Apartado
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}