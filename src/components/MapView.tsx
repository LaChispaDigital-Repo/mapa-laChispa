import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../store/useMapStore";
import { MapGeoJson } from "./MapGeoJson";
import "leaflet/dist/leaflet.css";
import { JuntasVecinosLayer } from "./JuntasVecinosLayer";

export const MapView = () => {
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const position = useMapStore((state) => state.position);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const juntasVecinos = useMapStore((state) => state.juntasVecinos);
  const selectedCommune = useMapStore((state) => state.selectedCommune);

  return (
    <div className="map-container">
      {/* Mapa principal */}
      <MapContainer center={position} zoom={9} className="map" key={`${position[0]}-${position[1]}`}>
        <LayersControl position="topright" key={`layers-${selectedRegion?.slug || "default"}`}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Capa de Juntas de Vecinos */}
          {selectedCommune && juntasVecinos && (
            <LayersControl.Overlay name={`Juntas de Vecinos - ${selectedCommune}`} checked>
              <JuntasVecinosLayer />
            </LayersControl.Overlay>
          )}

          {/* Capa de Unidades Vecinales */}
          {regionGeoJSON && selectedRegion && (
            <LayersControl.Overlay name={`Unidades Vecinales - ${selectedRegion.name}`} checked>
              <MapGeoJson />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Marcador en el centroide de la región seleccionada - solo si no hay UV seleccionada */}
        {selectedRegion && !selectedUnidadVecinal && (
          <Marker position={position as LatLngExpression}>
            <Popup>
              <strong>{selectedRegion.name}</strong>
              <br />
              Lat: {selectedRegion.centroide[0].toFixed(4)}
              <br />
              Lon: {selectedRegion.centroide[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
