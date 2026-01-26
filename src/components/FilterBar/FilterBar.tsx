import { useMapStore } from "../../store/useMapStore";
import { CommuneSelector } from "./CommuneSelector";
import { RegionSelector } from "./RegionSelector";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";
import { FiltroJJVV } from "./FiltroJJVV";
import { ProvinceSelector } from "./ProvinceSelector";
import { AddressSearch } from "./AddressSearch";

export const FilterBar = () => {
  const clearFilters = useMapStore((state) => state.clearFilters);

  return (
    <div className="w-full p-2">
      {/* Mobile: Collapse menu */}
      <div className="lg:hidden">
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium">Filtros</div>
          <div className="collapse-content flex flex-col gap-2">
            <RegionSelector />
            <ProvinceSelector />
            <CommuneSelector />
            <UnidadVecinalSelector />
            <FiltroJJVV />
            <AddressSearch />
            <button onClick={clearFilters()} className="btn btn-info">
              Limpiar selección
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-2 items-center">
        <div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Región</label>
    	  <RegionSelector />
  	</div>
  	
        <div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Provincia</label>
    	  <ProvinceSelector />
  	</div>
  	
        <div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Comuna</label>
    	  <CommuneSelector />
  	</div>
  
  	<div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Unidad Vecinal</label>
    	  <UnidadVecinalSelector />
  	</div>
  	
  	<div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Junta vecinal</label>
    	  <FiltroJJVV />
  	</div>
  	
  	<div className="flex flex-col gap-1">
    	  <label className="text-sm font-medium">Dirección</label>
    	  <AddressSearch />
  	</div>

        <button onClick={clearFilters()} className="btn btn-info">
          Limpiar selección
        </button>
      </div>
    </div>
  );
};
