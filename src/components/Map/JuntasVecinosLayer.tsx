import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useMapStore } from "../../store/useMapStore";
import { useEffect } from "react";

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

// Icono para marcador seleccionado (más grande y con otro color)
const selectedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl,
  iconSize: [30, 46],  // 20% más grande
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export const JuntasVecinosLayer = () => {
  // Estados del store
  const juntasVecinos = useMapStore((state) => state.juntasVecinos);
  const filteredJuntasVecinos = useMapStore((state) => state.filteredJuntasVecinos);
  const filtroNombreJJVV = useMapStore((state) => state.filtroNombreJJVV);
  const selectedJuntaVecinal = useMapStore((state) => state.selectedJuntaVecinal);
  
  // Determinar qué juntas mostrar:
  // 1. Si hay una junta seleccionada, mostrar SOLO esa junta
  // 2. Si hay un texto de filtro pero no hay junta seleccionada, mostrar las juntas filtradas
  // 3. En cualquier otro caso, mostrar todas las juntas
  const juntasToShow = selectedJuntaVecinal
    ? [selectedJuntaVecinal] // Solo mostrar la junta seleccionada
    : (filtroNombreJJVV && filtroNombreJJVV.trim() !== ""
      ? filteredJuntasVecinos
      : juntasVecinos);

  // Obtenemos la función para volar a una ubicación
  const flyToLocation = useMapStore((state) => state.flyToLocation);

  // Centrar el mapa en la junta seleccionada cuando cambie
  useEffect(() => {
    if (selectedJuntaVecinal && selectedJuntaVecinal.lat && selectedJuntaVecinal.lng) {
      console.log('Intentando volar a junta seleccionada:', selectedJuntaVecinal.nombre);
      
      // Usar la función centralizada para volar a las coordenadas
      const success = flyToLocation(selectedJuntaVecinal.lat, selectedJuntaVecinal.lng, 16);
      
      if (success) {
        // Opcional: Abrir el popup automáticamente después de centrar
        setTimeout(() => {
          const popups = document.querySelectorAll('.leaflet-popup-pane .leaflet-popup');
          if (popups.length === 0) { // Si no hay popup abierto
            const markers = document.querySelectorAll('.leaflet-marker-pane .leaflet-marker-icon');
            if (markers.length > 0) {
              // Simular un clic en el primer marcador (que debe ser el seleccionado)
              const markerElement = markers[0] as HTMLElement;
              markerElement.click();
            }
          }
        }, 1000);
      }
    }
  }, [selectedJuntaVecinal, flyToLocation]);
  
  console.log(
    "Mostrando juntas:", 
    juntasToShow.length, 
    "de", 
    juntasVecinos.length, 
    selectedJuntaVecinal ? "(Junta seleccionada: " + selectedJuntaVecinal.nombre + ")" : ""
  );

  return (
    <MarkerClusterGroup key={filtroNombreJJVV} showCoverageOnHover={false}>
      {juntasToShow.map((junta, index) => {
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

        // Determinar si este marcador es el seleccionado
        const isSelected = selectedJuntaVecinal && selectedJuntaVecinal.id === junta.id;
        
        return (
          <Marker 
            key={index} 
            position={position}
            icon={isSelected ? selectedIcon : defaultIcon}
            zIndexOffset={isSelected ? 1000 : 0} // El marcador seleccionado aparece sobre los demás
          >
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
