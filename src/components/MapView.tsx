import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../store/useMapStore";
import { MapGeoJson } from "./MapGeoJson";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";
import "leaflet/dist/leaflet.css";
import { RegionSelector } from "./RegionSelector";
import { CommuneSelector } from "./CommuneSelector";
import { ShowInfo } from "./ShowInfo";
import { JuntasVecinosLayer } from "./JuntasVecinosLayer";

export const MapView = () => {
  const { selectedRegion, regionGeoJSON, position, selectedUnidadVecinal, selectedCommune } = useMapStore();

  return (
    <div className="map-container">
      {/* Sidebar*/}
      <div className="sidebar">
        <RegionSelector />
        {selectedRegion && <CommuneSelector />}
        {selectedRegion && selectedCommune && <UnidadVecinalSelector />}
        {selectedRegion && selectedCommune && <ShowInfo />}
      </div>

      {/* Mapa principal */}
      <MapContainer center={position} zoom={12} className="map" key={`${position[0]}-${position[1]}`}>
        <LayersControl position="topright" key={`layers-${selectedRegion?.slug || "default"}`}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Capa de Juntas de Vecinos */}
          <LayersControl.Overlay name="Juntas de Vecinos - Villa Alemana" checked>
            <JuntasVecinosLayer />
          </LayersControl.Overlay>

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
