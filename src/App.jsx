import { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import ConfigurarTest from './pages/ConfigurarTest.jsx';
import EjecucionTest from './pages/EjecucionTest.jsx';
import Estadisticas from './pages/Estadisticas.jsx';
import { useGoogleLogin } from '@react-oauth/google';

export default function App() {
  const [tokenDrive, setTokenDrive] = useState(null);

  const login = useGoogleLogin({
  onSuccess: (tokenResponse) => {
    setTokenDrive(tokenResponse.access_token);
  },
  onError: (error) => console.log('Login Fallido:', error),
  scope: 'https://www.googleapis.com/auth/drive' // Actualizado para permitir edición
});

  return (
    <AppProvider tokenDrive={tokenDrive}>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="font-bold text-xl tracking-wide">Apprende</h1>
              
              <div className="flex items-center gap-4 font-medium text-sm">
                <Link to="/" className="hover:text-blue-200 transition">Hacer Test</Link>
                <Link to="/estadisticas" className="hover:text-blue-200 transition">Estadísticas</Link>
                
                {/* Botón de Google */}
                {/* Botón de Google */}
                {!tokenDrive ? (
                <button onClick={() => login()}
                        className="bg-white text-blue-600 px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-gray-100 transition text-xs" > Conectar Drive
                        </button>
                ) : (
                    <span className="bg-green-400 text-green-900 px-3 py-1.5 rounded-full font-bold shadow-sm text-xs tracking-wide">
                      ✓ Conectado
                    </span>
                )}
            </div>
            </div>
          </nav>
          <main className="max-w-4xl mx-auto p-4 py-8">
            <Routes>
              <Route path="/" element={<ConfigurarTest />} />
              <Route path="/test" element={<EjecucionTest />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}