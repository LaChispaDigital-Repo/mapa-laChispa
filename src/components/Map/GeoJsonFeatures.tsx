import { GeoJSON } from "react-leaflet";
import { useMapStore } from "../../store/useMapStore";
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import type { LeafletMouseEvent } from "leaflet";
import { mapPropsToUnidadVecinalAdapter } from "../../adapters/mapPropsUnidadVecinal.adapter";

export const GeoJsonFeatures = () => {
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const selectedProvince = useMapStore((state) => state.selectedProvince);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const getFilteredUVFeatures = useMapStore((state) => state.getFilteredUVFeatures);
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const setSelectedUnidadVecinal = useMapStore((state) => state.setSelectedUnidadVecinal);
  const setHoveredFeature = useMapStore((state) => state.setHoveredFeature);
  const geoJsonVersion = useMapStore((state) => state.geoJsonVersion);
  const setGraphicData = useMapStore((state) => state.setDemographicData);

  if (!regionGeoJSON || !selectedRegion) return null;

  const filteredFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: getFilteredUVFeatures() as Feature<Geometry, GeoJsonProperties>[],
  };

  const geoJsonKey = `geojson-${selectedRegion.slug}-${selectedProvince || "all"}-${
    selectedCommune?.id_comuna || "all"
  }-${selectedUnidadVecinal?.id || "all"}-v${geoJsonVersion}`;

  return (
    <GeoJSON
      key={geoJsonKey}
      data={filteredFeatures}
      style={(feature) => {
        const isSelected = feature?.properties?.id_uv === selectedUnidadVecinal?.id;
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

        if (props?.id_uv) {
          // Eventos de mouse simplificados
          layer.on({
            click: (e: LeafletMouseEvent) => {
              e.originalEvent.stopPropagation();
              const uvID = props.id_uv;
              const isCurrentlySelected = selectedUnidadVecinal?.id === uvID;
              // setSelectedUnidadVecinal(isCurrentlySelected ? null : mapPropsToUnidadVecinal(props));
              const newUV = isCurrentlySelected ? null : mapPropsToUnidadVecinalAdapter(props);
              setSelectedUnidadVecinal(newUV);
              setGraphicData(newUV?.datos_demograficos || null);
            },

            mouseover: (e: LeafletMouseEvent) => {
              const layer = e.target as L.Path;

              // Cambiar estilo en hover si no está seleccionada
              if (props.id_uv !== selectedUnidadVecinal?.id) {
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
              if (props.id_uv !== selectedUnidadVecinal?.id) {
                layer.setStyle({
                  color: "#3388ff",
                  weight: 3,
                  fillOpacity: 0.2,
                });
              }

              setHoveredFeature(null);
            },
          });

          // Tooltip actualizado con las nuevas propiedades
          layer.bindTooltip(
            `<div style="font-family: Arial, sans-serif; min-width: 200px;">
              <strong style="color: #2c3e50; font-size: 14px;">UV ${props.numero_uv}: ${props.nombre_uv}</strong>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
              <div style="font-size: 12px; color: #7f8c8d;">
                <div style="margin: 4px 0;"><strong>Comuna:</strong> ${props.nombre_comuna || "N/A"}</div>
                <div style="margin: 4px 0;"><strong>Provincia:</strong> ${props.nombre_provincia || "N/A"}</div>
                ${
                  props.tot_personas
                    ? `<div style="margin: 4px 0;"><strong>Población:</strong> ${props.tot_personas.toLocaleString()}</div>`
                    : ""
                }
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
