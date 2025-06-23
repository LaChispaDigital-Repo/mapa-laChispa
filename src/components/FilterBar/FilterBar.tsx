import { useMapStore } from "../../store/useMapStore";
import { CommuneSelector } from "./CommuneSelector";
import { RegionSelector } from "./RegionSelector";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";
import { FiltroJJVV } from "./FiltroJJVV";
import { ProvinceSelector } from "./ProvinceSelector";
import { AddressSearch } from "./AdressSearch";

export const FilterBar = () => {
  const clearFilters = useMapStore((state) => state.clearFilters);

  // Esta función se encarga de limpiar la selección de región}

  return (
    <div className="filterbar-container">
      <RegionSelector />
      <ProvinceSelector />
      <CommuneSelector />
      <UnidadVecinalSelector />
      <FiltroJJVV />
      {/* Adress Search me arroja problema de CORS */}
      <AddressSearch />
      <div>
        <button onClick={clearFilters()} className="btn btn-info w-full">
          Limpiar selección
        </button>
      </div>
    </div>
  );
};

// className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm
// focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400">
