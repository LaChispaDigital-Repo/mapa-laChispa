import { useEffect } from "react";
import { useMapStore, calculateCentroid } from "../store/useMapStore";

export const CommuneSelector = () => {
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const setSelectedCommune = useMapStore((state) => state.setSelectedCommune);
  const loading = useMapStore((state) => state.loading);
  const setPosition = useMapStore((state) => state.setPosition);
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const loadCommuneData = useMapStore((state) => state.loadCommuneData);
  const loadJuntasVecinos = useMapStore((state) => state.loadJuntasVecinos);
  const setSelectedUnidadVecinalData = useMapStore((state) => state.setSelectedUnidadVecinalData);
  const selectedProvince = useMapStore((state) => state.selectedProvince);

  // Obtener comunas filtradas por provincia seleccionada
  const communes = regionGeoJSON
    ? Array.from(
        new Map(
          regionGeoJSON.features
            .filter((f) => !selectedProvince || f.properties.t_prov_nom === selectedProvince)
            .map((f) => [f.properties.t_com, f.properties.t_com_nom])
        ).entries()
      )
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Resetear comuna si no existe en la región o no coincide con provincia
  useEffect(() => {
    if (selectedCommune && communes.length > 0) {
      const communeExists = communes.some((c) => c.code === selectedCommune);
      if (!communeExists) {
        console.log(`Comuna ${selectedCommune} no existe en la región/provincia, reseteando...`);
        setSelectedCommune(null);
      }
    }
  }, [communes, selectedCommune, setSelectedCommune]);

  // Resetear comuna si no pertenece a la provincia seleccionada
  useEffect(() => {
    if (selectedProvince && selectedCommune && regionGeoJSON) {
      const communeBelongsToProvince = regionGeoJSON.features.some(
        (f) => f.properties.t_com === selectedCommune && f.properties.t_prov_nom === selectedProvince
      );

      if (!communeBelongsToProvince) {
        setSelectedCommune(null);
      }
    }
  }, [selectedProvince, selectedCommune, regionGeoJSON, setSelectedCommune]);

  const handleCommuneChange = (communeCode: string | null) => {
    setSelectedCommune(communeCode);
    setSelectedUnidadVecinalData(null);
    loadCommuneData(communeCode || "");
    loadJuntasVecinos(communeCode || "");

    if (communeCode && regionGeoJSON) {
      const communeFeatures = regionGeoJSON.features.filter(
        (f) => f.properties.t_com === communeCode && (!selectedProvince || f.properties.t_prov_nom === selectedProvince)
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
    } else if (selectedRegion) {
      setPosition(selectedRegion.centroide);
    }
  };

  return (
    <select
      onChange={(e) => handleCommuneChange(e.target.value || null)}
      value={selectedCommune || ""}
      disabled={loading || !regionGeoJSON}
      className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400">
      <option value="">Comunas{selectedProvince ? ` de ${selectedProvince}` : ""}</option>
      {communes.map((commune) => (
        <option key={commune.code} value={commune.code}>
          {commune.name}
        </option>
      ))}
    </select>
  );
};
