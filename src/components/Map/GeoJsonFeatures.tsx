import { GeoJSON } from "react-leaflet";
import { useMapStore } from "../../store/useMapStore";
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import type { LeafletMouseEvent } from "leaflet";
import { mapPropsToUnidadVecinalAdapter } from "../../adapters/mapPropsUnidadVecinal.adapter";

export const GeoJsonFeatures = () => {
  // Obtener estados del store
  const {
    selectedRegion,
    selectedProvince,
    selectedCommune,
    selectedUnidadVecinal,
    getFilteredUVFeatures,
    regionGeoJSON,
    setSelectedUnidadVecinal,
    setHoveredFeature,
    geoJsonVersion,
    setDemographicData,
  } = useMapStore();

  if (!regionGeoJSON || !selectedRegion) return null;

  const filteredFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: getFilteredUVFeatures() as Feature<Geometry, GeoJsonProperties>[],
  };

  const geoJsonKey = `geojson-${selectedRegion.slug}-${selectedProvince || "all"}-${
    selectedCommune?.id_comuna || "all"
  }-${selectedUnidadVecinal?.id || "all"}-v${geoJsonVersion}`;

  // Estilo base para todas las features
  const baseStyle = {
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
    color: "#3388ff",
    fillColor: "#3388ff",
  };

  // Estilo para feature seleccionada
  const selectedStyle = {
    weight: 4,
    opacity: 1,
    fillOpacity: 0.4,
    color: "#ff6b35",
    fillColor: "#ff6b35",
  };

  // Estilo para hover
  const hoverStyle = {
    weight: 3,
    opacity: 1,
    fillOpacity: 0.3,
    color: "#ff9f43",
    fillColor: "#ff9f43",
  };

  return (
    <GeoJSON
      key={geoJsonKey}
      data={filteredFeatures}
      style={(feature) => {
        const isSelected = feature?.properties?.id_uv === selectedUnidadVecinal?.id;
        return isSelected ? selectedStyle : baseStyle;
      }}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        if (props?.id_uv) {
          // Eventos de mouse
          layer.on({
            click: (e: LeafletMouseEvent) => {
              e.originalEvent.stopPropagation();
              const uvID = props.id_uv;
              const isCurrentlySelected = selectedUnidadVecinal?.id === uvID;
              const newUV = isCurrentlySelected ? null : mapPropsToUnidadVecinalAdapter(props);

              setSelectedUnidadVecinal(newUV);
              setDemographicData(newUV?.datos_demograficos || selectedCommune?.datos_demograficos || null);

              // Forzar actualización de estilos
              (layer as L.Path).setStyle(isCurrentlySelected ? baseStyle : selectedStyle);
            },

            mouseover: (e: LeafletMouseEvent) => {
              const layer = e.target as L.Path;
              if (props.id_uv !== selectedUnidadVecinal?.id) {
                layer.setStyle(hoverStyle);
              }
              setHoveredFeature(feature as any);
            },

            mouseout: (e: LeafletMouseEvent) => {
              const layer = e.target as L.Path;
              if (props.id_uv !== selectedUnidadVecinal?.id) {
                layer.setStyle(baseStyle);
              }
              setHoveredFeature(null);
            },
          });

          // Tooltip
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
