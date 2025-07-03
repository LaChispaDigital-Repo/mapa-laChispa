// Función para calcular el centroide de una geometría GeoJSON

export function calculateCentroid(geometry: any): [number, number] {
  let totalLat = 0;
  let totalLng = 0;
  let pointCount = 0;

  function processCoordinates(coords: number[] | number[][] | number[][][]) {
    if (typeof coords[0] === "number") {
      // Es un punto [lng, lat]
      totalLng += coords[0] as number;
      totalLat += coords[1] as number;
      pointCount++;
    } else {
      // Es un array de arrays, procesar recursivamente
      (coords as any[]).forEach(processCoordinates);
    }
  }

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(processCoordinates);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon: any) => {
      polygon.forEach(processCoordinates);
    });
  }

  return pointCount > 0 ? [totalLat / pointCount, totalLng / pointCount] : [-33.048, -71.456];
}
