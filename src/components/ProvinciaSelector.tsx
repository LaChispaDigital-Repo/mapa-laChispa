import { useEffect } from "react";
import { useMapStore, calculateCentroid } from "../store/useMapStore";

export const ProvinciaSelector = () => {
  // Obtener el estado de la región, provincia seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand

  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const loading = useMapStore((state) => state.loading);
  const setPosition = useMapStore((state) => state.setPosition);
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const loadJuntasVecinos = useMapStore((state) => state.loadJuntasVecinos);
  const selectedProvince = useMapStore((state) => state.selectedProvince);
  const setSelectedProvince = useMapStore((state) => state.setSelectedProvince);

  // Variable para almacenar la lista de provincias de la región actual
  // Se obtiene del GeoJSON de la región cargado en la store
  // Se usa un Map para eliminar duplicados y luego se convierte a un array de objetos con código y nombre
  // Se ordena alfabéticamente por nombre de provincia

  const provinces = regionGeoJSON
    ? Array.from(
        new Map(regionGeoJSON.features.map((f) => [f.properties.t_prov_nom, f.properties.t_prov_nom])).entries()
      )
        .map(([_, name]) => ({ name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Auto-resetear provincia inválida
  useEffect(() => {
    if (selectedProvince && provinces.length > 0) {
      const provinceExists = provinces.some((c) => c.name === selectedProvince);
      if (!provinceExists) {
        console.log(`provincia ${selectedProvince} no existe en la nueva región, reseteando...`);
        setSelectedProvince(null);
      }
    }
  }, [provinces, selectedProvince, setSelectedProvince]);

  // Función para manejar el cambio de provincia que se llama al seleccionar una provincia del dropdown con el evento onChange
  // Esta función actualiza el estado de la provincia seleccionada y centra el mapa en el centroide de la provincia
  // Actualiza la

  const handleProvinceChange = (provinceName: string | null) => {
    setSelectedProvince(provinceName);
    console.log(provinceName);
    loadJuntasVecinos(provinceName || "");

    // Si se selecciona una provincia, centrar el mapa en su centroide
    if (provinceName && regionGeoJSON) {
      // Calcular centroide real de la provincia
      const provinceFeatures = regionGeoJSON.features.filter((f) => f.properties.t_prov_nom === provinceName);

      if (provinceFeatures.length > 0) {
        // Calcular el centroide promedio de todas las features de la provincia
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;

        provinceFeatures.forEach((feature) => {
          const [lat, lng] = calculateCentroid(feature.geometry);
          totalLat += lat;
          totalLng += lng;
          count++;
        });

        if (count > 0) {
          const avgLat = totalLat / count;
          const avgLng = totalLng / count;
          setPosition([avgLat, avgLng]);
          console.log(`Centrando en provincia: ${provinceName} -> [${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}]`);
        }
      }
    } else {
      // Si no se selecciona ninguna provincia, resetear la posición al centroide de la región
      // Volver al centroide de la región
      if (selectedRegion) {
        setPosition(selectedRegion.centroide);
      }
    }
  };

  return (
    <select
      onChange={(e) => handleProvinceChange(e.target.value || null)}
      value={selectedProvince || ""}
      disabled={loading || !regionGeoJSON}
      className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400">
      <option value="">Provincias</option>
      {provinces.map((province) => (
        <option key={province.name} value={province.name}>
          {province.name}
        </option>
      ))}
    </select>
  );
};
