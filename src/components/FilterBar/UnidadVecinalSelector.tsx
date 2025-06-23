import { useEffect, useMemo } from "react";
import { useMapStore } from "../../store/useMapStore";

export const UnidadVecinalSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand

  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const setSelectedUnidadVecinal = useMapStore((state) => state.setSelectedUnidadVecinal);
  const setGraphicData = useMapStore((state) => state.setDemographicData);
  const loading = useMapStore((state) => state.loading);

  const getUV = useMapStore((state) => state.getUnidadesVecinales);
  const unidadesVecinales = getUV();
  unidadesVecinales.sort((a, b) => a.nombre.localeCompare(b.nombre));

  useEffect(() => {
    // Esto asegura que cuando selectedUnidadVecinal cambie desde otro lugar (como el mapa)
    // el selector refleje el cambio
  }, [selectedUnidadVecinal]);

  // Función para manejar el cambio de unidad vecinal
  // Esta función actualiza el estado de la unidad vecinal seleccionada
  // y se llama al seleccionar una unidad vecinal del dropdown con el evento onChange
  const handleUVChange = (uvNombre: string | null) => {
    const selectedUV = uvNombre ? unidadesVecinales.find((c) => c.nombre === uvNombre) || null : null;
    setSelectedUnidadVecinal(selectedUV);
    console.log(selectedUV);
    console.log(unidadesVecinales);
    console.log(`Unidad vecinal seleccionada: ${uvNombre}`);
    setGraphicData(selectedUV?.datos_demograficos || null);
  };

  const getCommuneName = () => {
    if (!selectedCommune) return "";
    const comuna = useMapStore
      .getState()
      .getComunas()
      .find((p) => p.id_comuna === selectedCommune.id_comuna);
    return comuna?.nombre_comuna || selectedCommune.nombre_comuna;
  };

  return (
    <select
      onChange={(e) => handleUVChange(e.target.value)}
      value={selectedUnidadVecinal?.nombre || ""}
      className="select w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400"
      disabled={loading || !regionGeoJSON || !selectedCommune}>
      <option value="">
        {selectedCommune ? `Unidades vecinales de ${getCommuneName()}` : "Todas las unidades vecinales"}
      </option>
      {unidadesVecinales.map((uv, index) => (
        <option key={`${uv.id}-${index}`} value={uv.nombre}>
          {uv.nombre}
        </option>
      ))}
    </select>
  );
};
