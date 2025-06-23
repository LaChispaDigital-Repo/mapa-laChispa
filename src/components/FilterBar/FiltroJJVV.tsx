import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useMapStore } from "../../store/useMapStore";
import type { JuntaVecinal as JJVV } from "../../types/region-selector.inteface";

export const FiltroJJVV: React.FC = () => {
  const filtroNombreJJVV = useMapStore((state) => state.filtroNombreJJVV);
  const setFiltroNombreJJVV = useMapStore((state) => state.setFiltroNombreJJVV);
  const juntaVecinalList = useMapStore((state) => state.juntasVecinos);
  const filteredJuntasVecinos = useMapStore((state) => state.filteredJuntasVecinos);
  const setSelectedJuntaVecinal = useMapStore((state) => state.setSelectedJuntaVecinal);
  const setPosition = useMapStore((state) => state.setPosition);
  const selectedCommune = useMapStore((state) => state.selectedCommune);

  // Local state for input value (for immediate UI feedback)
  const [inputValue, setInputValue] = useState(filtroNombreJJVV);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update local state when store state changes (for reset after selection)
  useEffect(() => {
    setInputValue(filtroNombreJJVV);
  }, [filtroNombreJJVV]);

  // Debounce function with 300ms delay
  const debouncedSetFilter = useCallback(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (value: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setFiltroNombreJJVV(value);
        timeoutId = null;
      }, 300); // 300ms debounce delay
    };
  }, [setFiltroNombreJJVV]);

  // Memoize the debounce function to avoid recreation on each render
  const debouncedFilter = useMemo(() => debouncedSetFilter(), [debouncedSetFilter]);

  // Handle input change with debouncing
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue); // Update local state immediately for UI responsiveness
    debouncedFilter(newValue); // Debounce the actual store update
    setShowDropdown(true); // Show dropdown when typing
  };

  // Handle input focus
  const handleFocus = () => {
    if (inputValue.trim() !== "") {
      setShowDropdown(true);
    }
  };

  // Handle input blur with delay to allow for clicks
  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  // Usamos la lista filtrada del store para mostrar resultados
  const filteredJJVVs = useMemo(() => {
    if (!filtroNombreJJVV || filtroNombreJJVV.trim() === "") {
      return []; // Solo mostrar resultados si hay una consulta de filtro
    }
    return filteredJuntasVecinos;
  }, [filteredJuntasVecinos, filtroNombreJJVV]);

  const handleSelectJJVV = (jjvv: JJVV) => {
    console.log('Seleccionando junta:', jjvv.nombre, 'Coordenadas:', jjvv.lat, jjvv.lng);
    
    // Guardar la junta seleccionada en el store
    setSelectedJuntaVecinal(jjvv); 
    
    // Llamar directamente a flyToLocation para centrar el mapa
    const flyToLocation = useMapStore.getState().flyToLocation;
    if (jjvv.lat && jjvv.lng) {
      console.log('Intentando volar a:', jjvv.lat, jjvv.lng);
      const success = flyToLocation(jjvv.lat, jjvv.lng, 16);
      console.log('Resultado de flyTo:', success);
      
      // Solo actualizar position si flyTo falla como respaldo
      if (!success) {
        console.log('flyTo falló, usando setPosition como respaldo');
        setPosition([jjvv.lat, jjvv.lng]);
      }
    }
    
    // Mantener el valor del filtro con el nombre de la junta seleccionada
    setFiltroNombreJJVV(jjvv.nombre);
    
    // Actualizar input para reflejar la selección
    setInputValue(jjvv.nombre);
    
    setShowDropdown(false);
  };

  // Clear filter function
  const handleClearFilter = () => {
    setInputValue("");
    setFiltroNombreJJVV("");
    setShowDropdown(false);
    setSelectedJuntaVecinal(null); // Limpiar la junta seleccionada en el store
  };

  const isDisabled = !selectedCommune;
  const showResults = showDropdown && filtroNombreJJVV && filtroNombreJJVV.trim() !== "";

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          id="filtro-jjvv-nombre"
          placeholder="Buscar JJVV por nombre..."
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400 input"
        />
        {/* Clear button */}
        {inputValue && (
          <button
            onClick={handleClearFilter}
            className="ml-2 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-gray-200 rounded text-sm transition-colors"
            type="button">
            ✕
          </button>
        )}
      </div>

      {/* Status indicator */}
      {!isDisabled && inputValue && (
        <div className="mt-1 text-xs text-gray-400">
          {filtroNombreJJVV ? (
            <>
              {filteredJJVVs.length > 0 ? (
                <>
                  Mostrando {filteredJJVVs.length} resultado{filteredJJVVs.length !== 1 ? "s" : ""} en el mapa
                </>
              ) : (
                <>No se encontraron resultados</>
              )}
            </>
          ) : (
            <>Escribiendo...</>
          )}
        </div>
      )}

      {/* Display filtered results */}
      {showResults && filteredJJVVs.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredJJVVs.map((jjvv) => (
            <li
              key={jjvv.id}
              onClick={() => handleSelectJJVV(jjvv)}
              className="px-3 py-2 hover:bg-slate-600 cursor-pointer text-gray-200 border-b border-slate-600 last:border-b-0">
              <div className="font-medium">{jjvv.nombre}</div>
              {jjvv.direccion && <div className="text-xs text-gray-400 mt-1">{jjvv.direccion}</div>}
            </li>
          ))}
        </ul>
      )}

      {showResults && filteredJJVVs.length === 0 && juntaVecinalList.length > 0 && (
        <div className="absolute z-10 w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg text-gray-400">
          No se encontraron JJVV que coincidan con "{filtroNombreJJVV}".
        </div>
      )}
    </div>
  );
};
