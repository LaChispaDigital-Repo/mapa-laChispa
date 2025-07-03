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
  );
};
