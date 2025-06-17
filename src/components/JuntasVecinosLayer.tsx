import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useMapStore } from "../store/useMapStore";

// Corrige el problema del ícono por defecto en Leaflet con Webpack/Vite
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

  let juntasConCoordenadas = juntasVecinos.filter((junta) => junta.latitud !== null && junta.longitud !== null);

  if (filtroNombreJJVV.trim() !== "") {
    juntasConCoordenadas = juntasConCoordenadas.filter((junta) =>
      junta.nombre.toLowerCase().includes(filtroNombreJJVV.toLowerCase())
    );
  }

  return (
    <MarkerClusterGroup key={filtroNombreJJVV} showCoverageOnHover={false}>
      {juntasConCoordenadas.map((junta, index) => (
        <Marker key={index} position={[junta.latitud as number, junta.longitud as number]}>
          <Popup>
            <strong>{junta.nombre}</strong>
            <br />
            {junta.direccion}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
