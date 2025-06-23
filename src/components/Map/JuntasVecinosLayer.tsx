import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useMapStore } from "../../store/useMapStore";

// Corrige íconos por defecto de Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export const JuntasVecinosLayer = () => {
  const juntasVecinos = useMapStore((state) => state.juntasVecinos);
  const filtroNombreJJVV = useMapStore((state) => state.filtroNombreJJVV);

  console.log("Total de juntas recibidas:", juntasVecinos.length);

  return (
    <MarkerClusterGroup key={filtroNombreJJVV} showCoverageOnHover={false}>
      {juntasVecinos.map((junta, index) => {
        const { geometry, lat, lng, nombre, direccion } = junta;

        let position: [number, number] | null = null;

        if (geometry?.type === "Point" && Array.isArray(geometry.coordinates) && geometry.coordinates.length === 2) {
          const [lng, lat] = geometry.coordinates;
          position = [lat, lng];
        }

        if (!position && typeof lat === "number" && typeof lng === "number") {
          position = [lat, lng];
        }

        if (!position) {
          return null;
        }

        return (
          <Marker key={index} position={position}>
            <Popup>
              <strong>{nombre}</strong>
              <br />
              {direccion}
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
};
