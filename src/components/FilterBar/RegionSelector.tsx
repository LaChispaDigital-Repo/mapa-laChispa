import { useEffect } from "react";
import { useMapStore } from "../../store/useMapStore";

export const RegionSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand
  const regionList = useMapStore((state) => state.regionList);
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const setSelectedRegion = useMapStore((state) => state.setSelectedRegion);
  const loadRegions = useMapStore((state) => state.loadRegions);
  const loadRegionGeoJSON = useMapStore((state) => state.loadRegionGeoJSON);
  const loading = useMapStore((state) => state.loading);
  const setSelectedCommune = useMapStore((s) => s.setSelectedCommune);
  const setSelectedProvince = useMapStore((s) => s.setSelectedProvince);

  // Cargar lista de regiones al montar el componente con useEffect
  // Esto se hace una sola vez para evitar múltiples llamadas innecesarias

  useEffect(() => {
    // Cada vez que cambia la región seleccionada, resetea comuna y provincia
    setSelectedCommune(null);
    setSelectedProvince(null);
  }, [selectedRegion]);

  useEffect(() => {
    loadRegions();
  }, []);

  // Función para manejar el cambio de región que se llama al seleccionar una región del dropdown con el evento onChange
  // Esta función actualiza el estado de la región seleccionada y carga el GeoJSON de la región
  // Llamando a la función loadRegionGeoJSON desde la store

  const handleRegionSelect = (slug: string) => {
    if (!slug) {
      setSelectedRegion(null);
      return;
    }

    const region = regionList.find((r) => r.slug === slug);
    if (region) {
      setSelectedRegion(region);
      loadRegionGeoJSON();
    }
  };

  return (
    <select
      className="select w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400"
      onChange={(e) => handleRegionSelect(e.target.value)}
      value={selectedRegion?.slug || ""}
      disabled={loading}>
      <option value="">Selecciona una región</option>
      {regionList.map((region) => (
        <option key={region.id} value={region.slug}>
          {region.name}
        </option>
      ))}
      {/* TODO */}
      {/* Implementar componente Loader  */}
    </select>
  );
};
