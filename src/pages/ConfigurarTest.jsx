import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ESTADOS = [
  { value: 'null', label: 'Nuevas' },
  { value: 'fallada', label: 'Solo falladas' },
  { value: 'acertada', label: 'Repaso (acertadas)' },
  { value: 'todas', label: 'Mezclar todas' },
];

export default function ConfigurarTest() {
  const { temas, generarTest } = useContext(AppContext);
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    temaId: 'todos',
    apartadoId: 'todos',
    estado: 'null',
    limite: ''
  });

  const temaSeleccionado = temas.find(t => t.temaId === filtros.temaId);

  const iniciarTest = (e) => {
    e.preventDefault();
    generarTest(filtros);
    navigate('/test');
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E4E3DE] p-8 md:p-10"
      style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#17181C]">Configurar test</h2>
        <p className="text-[#6E7076] mt-1">Elige el alcance y el tipo de preguntas para empezar.</p>
      </div>

      <form onSubmit={iniciarTest} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-[#17181C]">Tema</label>
            <select
              value={filtros.temaId}
              onChange={(e) => setFiltros({ ...filtros, temaId: e.target.value, apartadoId: 'todos' })}
              className="p-3 bg-[#FAFAF9] border border-[#E4E3DE] rounded-lg text-[#17181C] focus:outline-none focus:ring-2 focus:ring-[#2D3F63]/30 focus:border-[#2D3F63] transition"
            >
              <option value="todos">Todos los temas</option>
              {temas.map(t => <option key={t.temaId} value={t.temaId}>{t.nombreTema}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-[#17181C]">Apartado</label>
            <select
              value={filtros.apartadoId}
              onChange={(e) => setFiltros({ ...filtros, apartadoId: e.target.value })}
              disabled={filtros.temaId === 'todos'}
              className="p-3 bg-[#FAFAF9] border border-[#E4E3DE] rounded-lg text-[#17181C] focus:outline-none focus:ring-2 focus:ring-[#2D3F63]/30 focus:border-[#2D3F63] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="todos">Todos los apartados</option>
              {temaSeleccionado?.apartados.map(a =>
                <option key={a.id} value={a.id}>{a.nombre}</option>
              )}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E4E3DE]">
          <label className="block mb-3 text-sm font-medium text-[#17181C]">Tipo de preguntas</label>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map(({ value, label }) => {
              const activo = filtros.estado === value;
              return (
                <label
                  key={value}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition
                    ${activo
                      ? 'bg-[#2D3F63] border-[#2D3F63] text-white'
                      : 'bg-white border-[#E4E3DE] text-[#6E7076] hover:border-[#2D3F63]/40 hover:text-[#17181C]'}
                  `}
                >
                  <input
                    type="radio" name="estado" value={value}
                    checked={activo}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                    className="sr-only"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-[#E4E3DE] flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex flex-col flex-1">
            <label className="mb-2 text-sm font-medium text-[#17181C]">Número de preguntas</label>
            <input
              type="number" placeholder="Vacío = todas"
              value={filtros.limite} onChange={(e) => setFiltros({ ...filtros, limite: e.target.value })}
              className="p-3 bg-[#FAFAF9] border border-[#E4E3DE] rounded-lg text-[#17181C] focus:outline-none focus:ring-2 focus:ring-[#2D3F63]/30 focus:border-[#2D3F63] transition"
              style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            />
          </div>

          <button
            type="submit"
            className="flex-1 md:flex-none md:px-10 bg-[#17181C] hover:bg-[#2D3F63] text-white font-semibold py-3.5 rounded-lg transition"
          >
            Comenzar test
          </button>
        </div>
      </form>
    </div>
  );
}