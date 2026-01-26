import { useMemo } from 'react';
import { useMapStore } from "../../store/useMapStore";

export const FiltroJJVV: React.FC = () => {
  const juntaVecinalList = useMapStore((state) => state.juntasVecinos);
  const selectedJuntaVecinal = useMapStore((state) => state.selectedJuntaVecinal);
  const setSelectedJuntaVecinal = useMapStore((state) => state.setSelectedJuntaVecinal);
  const setFiltroNombreJJVV = useMapStore((state) => state.setFiltroNombreJJVV);
  const selectedCommune = useMapStore((state) => state.selectedCommune);

  // Ordenar las juntas vecinales alfabéticamente
  const sortedJJVVs = useMemo(() => {
    return [...juntaVecinalList].sort((a, b) => 
      a.nombre.localeCompare(b.nombre, 'es')
    );
  }, [juntaVecinalList]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    
    if (!selectedId) {
      // Si se selecciona la opción vacía
      setSelectedJuntaVecinal(null);
      setFiltroNombreJJVV("");
      return;
    }

    // Buscar la junta vecinal seleccionada
    const jjvv = juntaVecinalList.find(j => j.id.toString() === selectedId);
    
    if (jjvv) {
      console.log("Seleccionando junta:", jjvv.nombre, "Coordenadas:", jjvv.lat, jjvv.lng);
      
      // Guardar la junta seleccionada en el store
      setSelectedJuntaVecinal(jjvv);
      setFiltroNombreJJVV(jjvv.nombre);

      // Llamar directamente a flyToLocation para centrar el mapa
      const flyToLocation = useMapStore.getState().flyToLocation;
      if (jjvv.lat && jjvv.lng) {
        console.log("Intentando volar a:", jjvv.lat, jjvv.lng);
        const success = flyToLocation(jjvv.lat, jjvv.lng, 16);
        console.log("Resultado de flyTo:", success);

        // Solo actualizar position si flyTo falla como respaldo
        if (!success) {
          console.log("flyTo falló, usando setPosition como respaldo");
          const setPosition = useMapStore.getState().setPosition;
          setPosition([jjvv.lat, jjvv.lng]);
        }
      }
    }
  };

  const isDisabled = !selectedCommune;

  return (
    <div className="relative">
      <div className="flex items-center">
        <select
          id="filtro-jjvv-select"
          value={selectedJuntaVecinal?.id || ""}
          onChange={handleSelectChange}
          disabled={isDisabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors ${
            isDisabled 
              ? 'bg-slate-800 text-gray-500 border-slate-700 cursor-not-allowed' 
              : 'bg-slate-700 text-gray-200 border-slate-600'
          }`}
        >
          <option value="">
            {isDisabled ? "Selecciona una comuna primero" : "Seleccionar JJVV..."}
          </option>
          {sortedJJVVs.map((jjvv) => (
            <option key={jjvv.id} value={jjvv.id}>
              {jjvv.nombre}
            </option>
          ))}
        </select>

        {/* Clear button */}
        {selectedJuntaVecinal && (
          <button
            onClick={() => {
              setSelectedJuntaVecinal(null);
              setFiltroNombreJJVV("");
            }}
            className="ml-2 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-gray-200 rounded text-sm transition-colors"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status indicator */}
      {!isDisabled && selectedJuntaVecinal && (
        <div className="mt-1 text-xs text-gray-400">
          JJVV seleccionada: {selectedJuntaVecinal.nombre}
        </div>
      )}
    </div>
  );
}
