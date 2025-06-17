import { useMapStore } from "../store/useMapStore";
import { CommuneSelector } from "./CommuneSelector";
import { RegionSelector } from "./RegionSelector";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";
import { FiltroJJVV } from "./FiltroJJVV";
import { ProvinciaSelector } from "./ProvinciaSelector";

export const FilterBar = () => {
  const clearFilters = useMapStore((state) => state.clearFilters);

  // Esta función se encarga de limpiar la selección de región}

  return (
    <div className="filterbar-container">
      <RegionSelector />
      {/* <h1>Implementar filtro provincia</h1> */}
      <ProvinciaSelector />
      <CommuneSelector />
      <UnidadVecinalSelector />
      <FiltroJJVV />
      <h1>Implementar ubicación</h1>
      <div>
        <button
          onClick={clearFilters()}
          className="w-full px-3 py-2 bg-gray-200 text-slate-700 border border-sky-500/30 rounded-md shadow-sm 
          hover:bg-slate-700 hover:border-slate-600 hover:text-gray-200        
          disabled:opacity-50 disabled:cursor-not-allowed 
          transition-colors duration-150 ease-in-out
          sm:text-sm cursor-pointer">
          Limpiar selección
        </button>
      </div>
    </div>
  );
};

// className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm
// focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400">
