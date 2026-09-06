import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children, tokenDrive }) {
  const [temas, setTemas] = useState([]);
  const [preguntasTestActivo, setPreguntasTestActivo] = useState([]);

  useEffect(() => {
    console.log("1. Token de Drive recibido:", tokenDrive ? "Sí (Token activo)" : "No (Vacío)");
    if (!tokenDrive) return;

    console.log("2. Buscando archivos JSON en Google Drive...");
    fetch("https://www.googleapis.com/drive/v3/files?q=name contains 'tema_' and mimeType='application/json' and trashed=false", {
      headers: { Authorization: `Bearer ${tokenDrive}` }
    })
    .then(res => {
      console.log("3. Código de estado HTTP de Google Drive:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("4. Respuesta completa de Google Drive:", data);
      if (data.files && data.files.length > 0) {
        console.log(`5. ¡Archivos encontrados! Total: ${data.files.length}`);
        
        const promesasArchivos = data.files.map(file => {
          console.log(`Descargando archivo: ${file.name} (ID: ${file.id})`);
          return fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
            headers: { Authorization: `Bearer ${tokenDrive}` }
          })
          .then(res => res.json())
          .then(contenidoJson => ({ ...contenidoJson, driveFileId: file.id }));
        });

        Promise.all(promesasArchivos).then(temasCargados => {
          console.log("6. Todos los temas cargados correctamente:", temasCargados);
          setTemas(temasCargados);
        });
      } else {
        console.warn("⚠️ Google Drive devolvió 0 archivos JSON. Comprueba que el archivo esté subido en esa cuenta.");
      }
    })
    .catch(err => console.error("❌ Error crítico conectando con Drive:", err));
  }, [tokenDrive]);

  const guardarEnDrive = (temaActualizado) => {
    if (!tokenDrive || !temaActualizado.driveFileId) return;

    const { driveFileId, ...datosLimpios } = temaActualizado;
    const metadata = new Blob([JSON.stringify(datosLimpios, null, 2)], { type: 'application/json' });
    
    fetch(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenDrive}` },
      body: metadata
    }).catch(err => console.error("Error guardando en Drive:", err));
  };

  const generarTest = (filtros) => {
    let todasLasPreguntas = [];
    temas.forEach(tema => {
      if (filtros.temaId === 'todos' || filtros.temaId === tema.temaId) {
        tema.preguntas.forEach(preg => {
          if (filtros.apartadoId === 'todos' || filtros.apartadoId === preg.apartadoId) {
            todasLasPreguntas.push({ ...preg, temaNombre: tema.nombreTema, temaId: tema.temaId });
          }
        });
      }
    });

    if (filtros.estado !== 'todas') {
      todasLasPreguntas = todasLasPreguntas.filter(p => 
        filtros.estado === 'null' ? p.estado === null : p.estado === filtros.estado
      );
    }

    let mezcladas = todasLasPreguntas.sort(() => Math.random() - 0.5);
    if (filtros.limite) {
      mezcladas = mezcladas.slice(0, parseInt(filtros.limite));
    }
    setPreguntasTestActivo(mezcladas);
  };

  const actualizarEstadoPregunta = (temaId, preguntaId, nuevoEstado) => {
    setTemas(prevTemas => {
      const nuevos = prevTemas.map(tema => {
        if (tema.temaId !== temaId) return tema;
        const temaModificado = {
          ...tema,
          preguntas: tema.preguntas.map(p => p.id === preguntaId ? { ...p, estado: nuevoEstado } : p)
        };
        guardarEnDrive(temaModificado);
        return temaModificado;
      });
      return nuevos;
    });
  };

  const resetearProgreso = (alcance, id = null, nuevoEstado = null) => {
    setTemas(prevTemas => {
      const nuevos = prevTemas.map(tema => {
        if (alcance === 'tema' && tema.temaId !== id) return tema;
        const temaModificado = {
          ...tema,
          preguntas: tema.preguntas.map(p => {
            if (alcance === 'apartado' && p.apartadoId !== id) return p;
            return { ...p, estado: nuevoEstado };
          })
        };
        guardarEnDrive(temaModificado);
        return temaModificado;
      });
      return nuevos;
    });
  };

  return (
    <AppContext.Provider value={{ temas, preguntasTestActivo, generarTest, actualizarEstadoPregunta, resetearProgreso }}>
      {children}
    </AppContext.Provider>
  );
}