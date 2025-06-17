import { useMapStore } from "../store/useMapStore";

export const UnidadVecinalSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand

  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const setSelectedUnidadVecinal = useMapStore((state) => state.setSelectedUnidadVecinal);
  const loading = useMapStore((state) => state.loading);
  const loadUnidadVecinalData = useMapStore((state) => state.loadUnidadVecinalData);

  // Obtener unidades vecinales disponibles (filtradas por comuna si está seleccionada)
  const unidadesVecinales = regionGeoJSON
    ? regionGeoJSON.features
        .filter((f) => !selectedCommune || f.properties.t_com === selectedCommune)
        .map((f) => ({
          name: f.properties.t_uv_nom,
          commune: f.properties.t_com_nom,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Función para manejar el cambio de unidad vecinal
  // Esta función actualiza el estado de la unidad vecinal seleccionada
  // y se llama al seleccionar una unidad vecinal del dropdown con el evento onChange
  const handleUVChange = (uvName: string) => {
    setSelectedUnidadVecinal(uvName);
    loadUnidadVecinalData(uvName);
  };

  return (
    <select
      className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400"
      onChange={(e) => handleUVChange(e.target.value)}
      value={selectedUnidadVecinal || ""}
      disabled={loading || !regionGeoJSON}>
      <option value="">{selectedCommune ? "Todas las UV de la comuna" : "Todas las unidades vecinales"}</option>
      {unidadesVecinales.map((uv, index) => (
        <option key={`${uv.name}-${index}`} value={uv.name}>
          {uv.name} {!selectedCommune && `(${uv.commune})`}
        </option>
      ))}
    </select>
  );
};
