import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../../store/useMapStore";
import { GeoJsonFeatures } from "./GeoJsonFeatures";
import "leaflet/dist/leaflet.css";
import { JuntasVecinosLayer } from "./JuntasVecinosLayer";
import { Loader } from "../common/Loader";
import { MapFlyToSearch } from "./MapFlyToSearch";

// Componente interno que registra la instancia del mapa en el store
const MapRegistrar = () => {
  const map = useMap();
  const setMapInstance = useMapStore((state) => state.setMapInstance);

  // Cuando el componente se monta, guardar la referencia al mapa
  useEffect(() => {
    console.log("Registrando mapa en store");
    setMapInstance(map);
    return () => {
      // Al desmontar, limpiar la referencia
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  return null; // Este componente no renderiza nada
};

export const MapView = () => {
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const regionGeoJSON = useMapStore((state) => state.regionGeoJSON);
  const position = useMapStore((state) => state.position);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const juntasVecinos = useMapStore((state) => state.juntasVecinos);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const loading = useMapStore((state) => state.loading);
  const searchPosition = useMapStore((state) => state.searchPosition);
  const searchAddress = useMapStore((state) => state.searchAddress);

  return (
    <div className="map-container">
      {/* Loader para mostrar mientras se cargan los datos */}
      {loading && <Loader text="Cargando datos de la región..." overlay />}
      {/* Mapa principal */}
      <MapContainer center={position} zoom={11} className="map" key={`${position[0]}-${position[1]}`}>
        {/* Componente interno para registrar el mapa en el store */}
        <MapRegistrar />
        <LayersControl position="topright" key={`layers-${selectedRegion?.slug || "default"}`}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Capa de Juntas de Vecinos */}
          {selectedCommune && juntasVecinos && (
            <LayersControl.Overlay name={`Juntas de Vecinos - ${selectedCommune.nombre_comuna}`} checked>
              <JuntasVecinosLayer />
            </LayersControl.Overlay>
          )}

          {/* Capa de Unidades Vecinales */}
          {regionGeoJSON && selectedRegion && (
            <LayersControl.Overlay name={`Unidades Vecinales - ${selectedRegion.name}`} checked>
              <GeoJsonFeatures />
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

        {/* Buscador de dirección */}
        {searchPosition && (
          <Marker position={searchPosition as LatLngExpression}>
            <Popup>
              <strong>📍 Dirección:</strong>
              <br />
              {searchAddress || "Dirección no disponible"}
            </Popup>
          </Marker>
        )}

        <MapFlyToSearch />
      </MapContainer>
    </div>
  );
};
