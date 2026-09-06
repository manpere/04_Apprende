import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Configurar nuevo test</h2>
      <form onSubmit={iniciarTest} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Tema</label>
            <select 
              value={filtros.temaId}
              onChange={(e) => setFiltros({...filtros, temaId: e.target.value, apartadoId: 'todos'})}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los temas</option>
              {temas.map(t => <option key={t.temaId} value={t.temaId}>{t.nombreTema}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Apartado</label>
            <select 
              value={filtros.apartadoId}
              onChange={(e) => setFiltros({...filtros, apartadoId: e.target.value})}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={filtros.temaId === 'todos'}
            >
              <option value="todos">Todos los apartados</option>
              {temaSeleccionado?.apartados.map(a => 
                <option key={a.id} value={a.id}>{a.nombre}</option>
              )}
            </select>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-semibold text-gray-700">Tipo de preguntas</label>
            <div className="flex flex-wrap gap-4">
              {['null', 'fallada', 'acertada', 'todas'].map(est => (
                <label key={est} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border">
                  <input 
                    type="radio" name="estado" value={est} 
                    checked={filtros.estado === est}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                    className="text-blue-600 w-4 h-4"
                  /> 
                  {est === 'null' ? 'Nuevas' : est === 'todas' ? 'Mezclar todas' : est === 'fallada' ? 'Solo falladas' : 'Repaso (Acertadas)'}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Número de preguntas</label>
            <input 
              type="number" placeholder="Ej: 20 (Vacío = todas)" 
              value={filtros.limite} onChange={(e) => setFiltros({...filtros, limite: e.target.value})}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg">
          ¡Comenzar Test!
        </button>
      </form>
    </div>
  );
}