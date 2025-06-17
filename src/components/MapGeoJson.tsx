import { GeoJSON } from "react-leaflet";
import { useMapStore } from "../store/useMapStore";
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import type { LeafletMouseEvent } from "leaflet";

export const MapGeoJson = () => {
  // const {
  //   selectedRegion,
  //   selectedCommune,
  //   selectedUnidadVecinal,
  //   getFilteredUVFeatures,
  //   regionGeoJSON,
  //   setSelectedUnidadVecinal,
  //   setHoveredFeature,
  //   geoJsonVersion,
  //   loadCommuneData,
  //   loadUnidadVecinalData,
  // } = useMapStore();

  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const getFilteredUVFeatures = useMapStore((state) => state.getFilteredUVFeatures);
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const setSelectedUnidadVecinal = useMapStore((state) => state.setSelectedUnidadVecinal);
  const setHoveredFeature = useMapStore((state) => state.setHoveredFeature);
  const geoJsonVersion = useMapStore((state) => state.geoJsonVersion);
  const loadCommuneData = useMapStore((state) => state.loadCommuneData);
  const loadUnidadVecinalData = useMapStore((state) => state.loadUnidadVecinalData);

  if (!regionGeoJSON || !selectedRegion) return null;

  const filteredFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: getFilteredUVFeatures() as Feature<Geometry, GeoJsonProperties>[],
  };

  const geoJsonKey = `geojson-${selectedRegion.slug}-${selectedCommune || "all"}-${
    selectedUnidadVecinal || "all"
  }-v${geoJsonVersion}`;

  return (
    <GeoJSON
      key={geoJsonKey}
      data={filteredFeatures}
      style={(feature) => {
        const isSelected = feature?.properties?.t_uv_nom === selectedUnidadVecinal;
        return {
          color: isSelected ? "#ff6b35" : "#3388ff",
          weight: isSelected ? 3 : 3,
          opacity: isSelected ? 1 : 0.8,
          fillOpacity: isSelected ? 0.4 : 0.2,
          fillColor: isSelected ? "#ff6b35" : "#3388ff",
        };
      }}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        if (props?.t_uv_nom) {
          // Eventos de mouse simplificados
          layer.on({
            click: (e: LeafletMouseEvent) => {
              e.originalEvent.stopPropagation();
              const uvName = props.t_uv_nom;
              const isCurrentlySelected = selectedUnidadVecinal === uvName;

              setSelectedUnidadVecinal(isCurrentlySelected ? null : uvName);
              loadUnidadVecinalData(uvName);
              loadCommuneData(!isCurrentlySelected ? null : props.t_com);
              console.log(`UV ${isCurrentlySelected ? "deseleccionada" : "seleccionada"}: ${uvName}`);
            },

            mouseover: (e: LeafletMouseEvent) => {
              const layer = e.target as L.Path;

              // Cambiar estilo en hover si no está seleccionada
              if (props.t_uv_nom !== selectedUnidadVecinal) {
                layer.setStyle({
                  color: "#ff9f43",
                  weight: 2,
                  fillOpacity: 0.3,
                });
              }

              setHoveredFeature(feature as any);
            },

            mouseout: (e: LeafletMouseEvent) => {
              const layer = e.target as L.Path;

              // Restaurar estilo original si no está seleccionada
              if (props.t_uv_nom !== selectedUnidadVecinal) {
                layer.setStyle({
                  color: "#3388ff",
                  weight: 3,
                  fillOpacity: 0.2,
                });
              }

              setHoveredFeature(null);
            },
          });

          // Usar Tooltip nativo de React Leaflet
          layer.bindTooltip(
            `<div style="font-family: Arial, sans-serif; min-width: 200px;">
              <strong style="color: #2c3e50; font-size: 14px;">${props.t_uv_nom}</strong>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
              <div style="font-size: 12px; color: #7f8c8d;">
                <div style="margin: 4px 0;"><strong>Comuna:</strong> ${props.t_com_nom || "N/A"}</div>
              </div>
            </div>`,
            {
              permanent: false,
              direction: "top",
              offset: [0, -10],
              className: "custom-tooltip",
            }
          );
        }
      }}
    />
  );
};
