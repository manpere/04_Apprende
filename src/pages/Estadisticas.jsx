import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const sans = { fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" };

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
    <div className="space-y-6" style={sans}>
      <h2 className="text-2xl font-semibold text-[#17181C]">Estadísticas y gestión</h2>

      {/* -- TARJETA GLOBAL -- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E4E3DE]">
        <h3 className="text-sm font-medium text-[#6E7076] mb-6">Progreso global</h3>
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6">
          <div className="text-center md:text-left border-r border-[#E4E3DE] last:border-r-0">
            <span className="block text-3xl md:text-4xl font-semibold text-[#3D7A5C]" style={mono}>{globalAcertadas}</span>
            <span className="text-xs md:text-sm text-[#6E7076] mt-1 block">Acertadas</span>
          </div>
          <div className="text-center md:text-left border-r border-[#E4E3DE] last:border-r-0">
            <span className="block text-3xl md:text-4xl font-semibold text-[#AB4A3C]" style={mono}>{globalFalladas}</span>
            <span className="text-xs md:text-sm text-[#6E7076] mt-1 block">Falladas</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl md:text-4xl font-semibold text-[#17181C]" style={mono}>{globalNulas}</span>
            <span className="text-xs md:text-sm text-[#6E7076] mt-1 block">Sin responder</span>
          </div>
        </div>

        <div className="pt-5 border-t border-[#E4E3DE] flex justify-end">
          <button
            onClick={() => manejarReseteo('global', null, 'TODO EL PROGRESO')}
            className="text-[#AB4A3C] font-medium hover:bg-[#AB4A3C]/5 px-4 py-2 rounded-lg transition text-sm"
          >
            Resetear todo el progreso
          </button>
        </div>
      </div>

      {/* -- DETALLE POR TEMAS Y APARTADOS -- */}
      <h3 className="text-lg font-semibold text-[#17181C] pt-2">Detalle por temas y apartados</h3>
      <div className="space-y-3">
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
            <div key={tema.temaId} className="bg-white rounded-xl border border-[#E4E3DE] overflow-hidden">

              {/* Cabecera del Tema (Clicable para desplegar apartados) */}
              <div className={`p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${isOpen ? 'bg-[#FAFAF9]' : 'hover:bg-[#FAFAF9]'}`}>
                <div className="flex-1 cursor-pointer w-full" onClick={() => setTemaExpandido(isOpen ? null : tema.temaId)}>
                  <h4 className="font-medium text-[#17181C] flex items-center gap-2">
                    {tema.nombreTema}
                    <span className={`text-xs text-[#6E7076] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </h4>
                  <div className="flex gap-4 text-sm mt-1.5" style={mono}>
                    <span className="text-[#3D7A5C]">{tAcertadas} A</span>
                    <span className="text-[#AB4A3C]">{tFalladas} F</span>
                    <span className="text-[#6E7076]">{tNulas} SR</span>
                  </div>
                </div>

                <button
                  onClick={() => manejarReseteo('tema', tema.temaId, `el tema: ${tema.nombreTema}`)}
                  className="text-[#AB4A3C] hover:bg-[#AB4A3C]/5 font-medium py-2 px-4 rounded-lg text-sm transition w-full md:w-auto border border-transparent hover:border-[#AB4A3C]/20"
                >
                  Resetear tema
                </button>
              </div>

              {/* Acordeón: Detalle de los Apartados */}
              {isOpen && (
                <div className="bg-[#FAFAF9] p-4 md:p-5 border-t border-[#E4E3DE] space-y-2.5">
                  <h5 className="text-xs font-medium text-[#6E7076] mb-1">Apartados del tema</h5>

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
                      <div key={apartado.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-4 rounded-lg border border-[#E4E3DE]">
                        <div>
                          <span className="font-medium text-[#17181C] text-sm">{apartado.nombre}</span>
                          <div className="flex gap-3 text-sm mt-1" style={mono}>
                            <span className="text-[#3D7A5C]">{aAcertadas} A</span>
                            <span className="text-[#AB4A3C]">{aFalladas} F</span>
                            <span className="text-[#6E7076]">{aNulas} SR</span>
                          </div>
                        </div>
                        <button
                          onClick={() => manejarReseteo('apartado', apartado.id, `el apartado: ${apartado.nombre}`)}
                          className="text-[#6E7076] hover:text-[#AB4A3C] hover:bg-[#AB4A3C]/5 font-medium py-1.5 px-3 rounded-md text-xs transition w-full md:w-auto border border-[#E4E3DE]"
                        >
                          Resetear apartado
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