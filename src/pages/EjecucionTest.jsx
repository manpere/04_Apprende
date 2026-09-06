import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function EjecucionTest() {
  const { preguntasTestActivo, actualizarEstadoPregunta } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [indice, setIndice] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  
  // Nuevos estados para la vista de resultados
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [preguntaExpandida, setPreguntaExpandida] = useState(null);
  
  // Si no hay preguntas (ej: entras directo a /test sin configurar)
  if (preguntasTestActivo.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No se encontraron preguntas</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded">Volver al inicio</button>
      </div>
    );
  }

  // --- VISTA 2: PANTALLA DE RESULTADOS ---
  if (mostrarResultados) {
    const aciertos = preguntasTestActivo.filter((p, i) => respuestasUsuario[i] === p.correcta).length;
    const fallos = preguntasTestActivo.length - aciertos;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800">Resultados del Test</h2>
        
        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 text-center">
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
            <span className="block text-5xl font-black text-green-600 mb-2">{aciertos}</span>
            <span className="text-green-800 font-bold uppercase tracking-wide">Acertadas</span>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 shadow-sm">
            <span className="block text-5xl font-black text-red-600 mb-2">{fallos}</span>
            <span className="text-red-800 font-bold uppercase tracking-wide">Falladas</span>
          </div>
        </div>

        {/* Cuadrícula de acceso rápido (Mapa de preguntas) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Mapa de respuestas (Pulsa para ver detalle)</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {preguntasTestActivo.map((p, i) => {
              const esAcertada = respuestasUsuario[i] === p.correcta;
              return (
                <button 
                  key={i}
                  onClick={() => setPreguntaExpandida(preguntaExpandida === i ? null : i)}
                  className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-bold text-white transition-all shadow-sm hover:scale-105
                    ${esAcertada ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                    ${preguntaExpandida === i ? 'ring-4 ring-blue-300 scale-110' : ''}
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Acordeones con la corrección detallada */}
        <div className="space-y-4">
          {preguntasTestActivo.map((p, i) => {
            const esAcertada = respuestasUsuario[i] === p.correcta;
            const isOpen = preguntaExpandida === i;

            return (
              <div key={i} className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${esAcertada ? 'border-green-100' : 'border-red-100'}`}>
                {/* Cabecera del Acordeón */}
                <button 
                  onClick={() => setPreguntaExpandida(isOpen ? null : i)}
                  className={`w-full p-4 md:p-5 flex justify-between items-center text-left font-semibold transition-colors
                    ${esAcertada ? 'bg-green-50 hover:bg-green-100 text-green-900' : 'bg-red-50 hover:bg-red-100 text-red-900'}
                  `}
                >
                  <span className="truncate pr-4 flex-1">
                    <span className="font-black mr-2">{i + 1}.</span> {p.enunciado}
                  </span>
                  <span className="text-xl px-2">{isOpen ? '▲' : '▼'}</span>
                </button>
                
                {/* Contenido Desplegable */}
                {isOpen && (
                  <div className="p-5 bg-white space-y-3 border-t border-gray-100">
                    <p className="text-gray-800 font-bold mb-4">{p.enunciado}</p>
                    
                    {p.opciones.map((opcion, indexOpcion) => {
                      let claseOpcion = "p-3 md:p-4 rounded-lg border-2 flex justify-between items-center ";
                      let icono = "";
                      
                      if (indexOpcion === p.correcta) {
                        claseOpcion += "bg-green-50 border-green-500 text-green-800 font-bold";
                        icono = "✓ Correcta";
                      } else if (indexOpcion === respuestasUsuario[i]) {
                        claseOpcion += "bg-red-50 border-red-500 text-red-800 line-through opacity-80";
                        icono = "✗ Tu respuesta";
                      } else {
                        claseOpcion += "bg-gray-50 border-gray-100 text-gray-500";
                      }

                      return (
                        <div key={indexOpcion} className={claseOpcion}>
                          <span>{opcion}</span>
                          <span className="text-sm font-black tracking-wide">{icono}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botones Finales */}
        <div className="flex flex-col md:flex-row justify-center gap-4 pt-4 pb-12">
          <button onClick={() => navigate('/')} className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition">
            Hacer otro Test
          </button>
          <button onClick={() => navigate('/estadisticas')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition">
            Ir a Estadísticas
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA 1: EJECUCIÓN DEL TEST ---
  const preguntaActual = preguntasTestActivo[indice];
  const opcionMarcada = respuestasUsuario[indice];
  const yaRespondida = opcionMarcada !== undefined;

  const manejarRespuesta = (opcionIndex) => {
    if (yaRespondida) return;
    
    const esCorrecta = opcionIndex === preguntaActual.correcta;
    const nuevoEstado = esCorrecta ? 'acertada' : 'fallada';
    
    setRespuestasUsuario({ ...respuestasUsuario, [indice]: opcionIndex });
    
    const temaId = preguntaActual.id.split('_')[0]; 
    actualizarEstadoPregunta(temaId, preguntaActual.id, nuevoEstado);
  };

  const esUltima = indice === preguntasTestActivo.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm font-semibold text-gray-500 mb-2">
        <span>{preguntaActual.temaNombre}</span>
        <span>Pregunta {indice + 1} de {preguntasTestActivo.length}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${((indice + 1) / preguntasTestActivo.length) * 100}%` }}></div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-snug">
          {preguntaActual.enunciado}
        </h3>

        <div className="space-y-3">
          {preguntaActual.opciones.map((opcion, i) => {
            let colorClase = "bg-gray-50 border-gray-200 hover:bg-blue-50 cursor-pointer";
            
            if (yaRespondida) {
              if (i === preguntaActual.correcta) {
                colorClase = "bg-green-100 border-green-500 text-green-800 font-bold scale-[1.02] shadow-sm";
              } else if (i === opcionMarcada) {
                colorClase = "bg-red-100 border-red-500 text-red-800 line-through opacity-70";
              } else {
                colorClase = "bg-gray-50 border-gray-100 opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => manejarRespuesta(i)}
                className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${colorClase}`}
              >
                {opcion}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={() => setIndice(indice - 1)}
          disabled={indice === 0}
          className={`px-6 py-3 rounded-xl font-bold transition ${indice === 0 ? 'opacity-0 cursor-default' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          Anterior
        </button>
        
        {!esUltima ? (
          <button 
            onClick={() => setIndice(indice + 1)}
            disabled={!yaRespondida}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md
              ${yaRespondida ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Siguiente
          </button>
        ) : (
          <button 
            onClick={() => setMostrarResultados(true)} // <-- AQUÍ CAMBIA A LA PANTALLA DE RESULTADOS
            disabled={!yaRespondida}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md
              ${yaRespondida ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Ver Resultados
          </button>
        )}
      </div>
    </div>
  );
}