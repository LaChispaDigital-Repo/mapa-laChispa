import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapStore } from "../../store/useMapStore";

export const MapFlyToSearch = () => {
  const map = useMap();
  const { searchPosition } = useMapStore();

  useEffect(() => {
    if (searchPosition) {
      map.flyTo(searchPosition, 16);
    }
  }, [searchPosition]);

  return null;
};
