import { useMapStore, calculateCentroid } from "../../store/useMapStore";

export const CommuneSelector = () => {
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const setSelectedCommune = useMapStore((state) => state.setSelectedCommune);
  const loading = useMapStore((state) => state.loading);
  const setPosition = useMapStore((state) => state.setPosition);
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const selectedProvince = useMapStore((state) => state.selectedProvince);
  const setGraphicData = useMapStore((state) => state.setDemographicData);
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const setJuntasVecinos = useMapStore((state) => state.setJuntasVecinos);
  const loadDates = useMapStore((state) => state.loadDates);

  // Usar el getter optimizado
  const getComunas = useMapStore((state) => state.getComunas);
  const communes = getComunas();

  const handleCommuneChange = async (communeId: string | null) => {
    console.log(`Comuna seleccionada: ${communeId}`);
    const selectedCommune = communeId ? communes.find((c) => c.id_comuna === communeId) || null : null;
    setSelectedCommune(selectedCommune);
    setGraphicData(selectedCommune?.datos_demograficos || null);
    setJuntasVecinos(selectedCommune?.juntas_vecinos || []);

    // Cargar las fechas cuando se selecciona una comuna
    if (communeId) {
      loadDates(communeId);
    }

    if (communeId) {
      try {
        // Cargar datos usando las funciones optimizadas del store
        // Calcular y establecer posición del mapa

        // TODO - REFACTORIZAR O EN SU DEFECTO EN EL BACKEND CALCULAR EL CENTROIDE DE LA COMUNA Y ENTREGARLA COMO PROPIEDAD
        if (regionGeoJSON) {
          const communeFeatures = regionGeoJSON.features.filter(
            (f) =>
              f.properties.id_comuna === communeId &&
              (!selectedProvince || f.properties.id_provincia === selectedProvince)
          );

          if (communeFeatures.length > 0) {
            let totalLat = 0;
            let totalLng = 0;
            let count = 0;

            communeFeatures.forEach((feature) => {
              const [lat, lng] = calculateCentroid(feature.geometry);
              totalLat += lat;
              totalLng += lng;
              count++;
            });

            if (count > 0) {
              const avgLat = totalLat / count;
              const avgLng = totalLng / count;
              setPosition([avgLat, avgLng]);
            }
          }
        }
      } catch (error) {
        console.error("Error cargando datos de la comuna:", error);
      }
    } else if (selectedRegion) {
      setPosition(selectedRegion.centroide);
    }
  };

  const getProvinceName = () => {
    if (!selectedProvince) return "";
    const provincia = useMapStore
      .getState()
      .getProvincias()
      .find((p) => p.id_provincia === selectedProvince);
    return provincia?.nombre_provincia || selectedProvince;
  };

  return (
    <select
      onChange={(e) => handleCommuneChange(e.target.value || null)}
      value={selectedCommune?.id_comuna || ""}
      disabled={loading || !regionGeoJSON}
      className="select w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400">
      <option value="">{selectedProvince ? `Comunas de ${getProvinceName()}` : "Todas las comunas"}</option>
      {communes.map((commune) => (
        <option key={commune.id_comuna} value={commune.id_comuna}>
          {commune.nombre_comuna.charAt(0).toUpperCase() + commune.nombre_comuna.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
};
