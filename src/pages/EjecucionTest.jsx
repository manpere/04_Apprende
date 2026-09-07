import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans = { fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" };

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
      <div className="text-center py-20" style={sans}>
        <h2 className="text-2xl font-semibold text-[#17181C] mb-4">No se encontraron preguntas</h2>
        <button onClick={() => navigate('/')} className="bg-[#17181C] hover:bg-[#2D3F63] text-white px-6 py-2.5 rounded-lg transition">Volver al inicio</button>
      </div>
    );
  }

  // --- VISTA 2: PANTALLA DE RESULTADOS ---
  if (mostrarResultados) {
    const aciertos = preguntasTestActivo.filter((p, i) => respuestasUsuario[i] === p.correcta).length;
    const fallos = preguntasTestActivo.length - aciertos;

    return (
      <div className="max-w-3xl mx-auto space-y-6" style={sans}>
        <h2 className="text-2xl font-semibold text-[#17181C]">Resultados del test</h2>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-2 gap-4 bg-white border border-[#E4E3DE] rounded-2xl p-6 md:p-8">
          <div className="text-center border-r border-[#E4E3DE]">
            <span className="block text-4xl md:text-5xl font-semibold text-[#3D7A5C]" style={mono}>{aciertos}</span>
            <span className="text-[#6E7076] text-sm mt-1 block">Acertadas</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl md:text-5xl font-semibold text-[#AB4A3C]" style={mono}>{fallos}</span>
            <span className="text-[#6E7076] text-sm mt-1 block">Falladas</span>
          </div>
        </div>

        {/* Cuadrícula de acceso rápido (Mapa de preguntas) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4E3DE]">
          <h3 className="text-sm font-medium text-[#6E7076] mb-4">Mapa de respuestas · pulsa para ver el detalle</h3>
          <div className="flex flex-wrap gap-2">
            {preguntasTestActivo.map((p, i) => {
              const esAcertada = respuestasUsuario[i] === p.correcta;
              const isOpen = preguntaExpandida === i;
              return (
                <button
                  key={i}
                  onClick={() => setPreguntaExpandida(isOpen ? null : i)}
                  style={mono}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium border transition
                    ${esAcertada
                      ? 'bg-[#3D7A5C]/10 border-[#3D7A5C]/30 text-[#3D7A5C]'
                      : 'bg-[#AB4A3C]/10 border-[#AB4A3C]/30 text-[#AB4A3C]'}
                    ${isOpen ? 'ring-2 ring-offset-1 ring-[#2D3F63]' : ''}
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Acordeones con la corrección detallada */}
        <div className="space-y-3">
          {preguntasTestActivo.map((p, i) => {
            const esAcertada = respuestasUsuario[i] === p.correcta;
            const isOpen = preguntaExpandida === i;

            return (
              <div key={i} className="bg-white border border-[#E4E3DE] rounded-xl overflow-hidden">
                {/* Cabecera del Acordeón */}
                <button
                  onClick={() => setPreguntaExpandida(isOpen ? null : i)}
                  className="w-full p-4 md:p-5 flex justify-between items-center text-left transition hover:bg-[#FAFAF9]"
                >
                  <span className="flex items-center gap-3 pr-4 flex-1 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${esAcertada ? 'bg-[#3D7A5C]' : 'bg-[#AB4A3C]'}`} />
                    <span className="truncate text-[#17181C] font-medium">{p.enunciado}</span>
                  </span>
                  <span className="text-[#6E7076] shrink-0">{isOpen ? '−' : '+'}</span>
                </button>

                {/* Contenido Desplegable */}
                {isOpen && (
                  <div className="p-5 pt-0 space-y-2">
                    {p.opciones.map((opcion, indexOpcion) => {
                      let claseOpcion = "p-3 rounded-lg border flex justify-between items-center gap-3 ";
                      let icono = "";

                      if (indexOpcion === p.correcta) {
                        claseOpcion += "bg-[#3D7A5C]/5 border-[#3D7A5C]/30 text-[#17181C]";
                        icono = "Correcta";
                      } else if (indexOpcion === respuestasUsuario[i]) {
                        claseOpcion += "bg-[#AB4A3C]/5 border-[#AB4A3C]/30 text-[#6E7076] line-through";
                        icono = "Tu respuesta";
                      } else {
                        claseOpcion += "border-[#E4E3DE] text-[#6E7076]";
                      }

                      return (
                        <div key={indexOpcion} className={claseOpcion}>
                          <span className="text-sm">{opcion}</span>
                          {icono && (
                            <span className={`text-xs font-medium shrink-0 ${indexOpcion === p.correcta ? 'text-[#3D7A5C]' : 'text-[#AB4A3C]'}`}>
                              {icono}
                            </span>
                          )}
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
        <div className="flex flex-col md:flex-row gap-3 pt-2 pb-12">
          <button onClick={() => navigate('/')} className="flex-1 py-3.5 bg-white border border-[#E4E3DE] hover:border-[#17181C]/30 text-[#17181C] font-medium rounded-xl transition">
            Hacer otro test
          </button>
          <button onClick={() => navigate('/estadisticas')} className="flex-1 py-3.5 bg-[#17181C] hover:bg-[#2D3F63] text-white font-medium rounded-xl transition">
            Ir a estadísticas
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
    <div className="max-w-2xl mx-auto space-y-6" style={sans}>
      <div className="flex justify-between items-baseline text-sm text-[#6E7076]">
        <span>{preguntaActual.temaNombre}</span>
        <span style={mono}>{indice + 1} / {preguntasTestActivo.length}</span>
      </div>

      <div className="w-full bg-[#E4E3DE] rounded-full h-1.5">
        <div className="bg-[#2D3F63] h-1.5 rounded-full transition-all duration-300" style={{ width: `${((indice + 1) / preguntasTestActivo.length) * 100}%` }}></div>
      </div>

      <div className="bg-white p-6 md:p-9 rounded-2xl border border-[#E4E3DE]">
        <h3 className="text-lg md:text-xl font-medium text-[#17181C] mb-7 leading-snug">
          {preguntaActual.enunciado}
        </h3>

        <div className="space-y-2.5">
          {preguntaActual.opciones.map((opcion, i) => {
            let colorClase = "border-[#E4E3DE] hover:border-[#2D3F63]/40 hover:bg-[#FAFAF9] cursor-pointer";

            if (yaRespondida) {
              if (i === preguntaActual.correcta) {
                colorClase = "bg-[#3D7A5C]/5 border-[#3D7A5C] text-[#17181C] font-medium";
              } else if (i === opcionMarcada) {
                colorClase = "bg-[#AB4A3C]/5 border-[#AB4A3C] text-[#6E7076] line-through";
              } else {
                colorClase = "border-[#E4E3DE] text-[#6E7076] opacity-60";
              }
            }

            return (
              <button
                key={i}
                onClick={() => manejarRespuesta(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 text-[#17181C] ${colorClase}`}
              >
                {opcion}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setIndice(indice - 1)}
          disabled={indice === 0}
          className={`px-5 py-2.5 rounded-lg font-medium transition ${indice === 0 ? 'opacity-0 pointer-events-none' : 'text-[#6E7076] hover:text-[#17181C] hover:bg-[#F3F3F1]'}`}
        >
          Anterior
        </button>

        {!esUltima ? (
          <button
            onClick={() => setIndice(indice + 1)}
            disabled={!yaRespondida}
            className={`px-8 py-3 rounded-xl font-medium text-white transition
              ${yaRespondida ? 'bg-[#17181C] hover:bg-[#2D3F63]' : 'bg-[#E4E3DE] text-[#6E7076] cursor-not-allowed'}`}
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={() => setMostrarResultados(true)} // <-- AQUÍ CAMBIA A LA PANTALLA DE RESULTADOS
            disabled={!yaRespondida}
            className={`px-8 py-3 rounded-xl font-medium text-white transition
              ${yaRespondida ? 'bg-[#3D7A5C] hover:bg-[#336a4e]' : 'bg-[#E4E3DE] text-[#6E7076] cursor-not-allowed'}`}
          >
            Ver resultados
          </button>
        )}
      </div>
    </div>
  );
}