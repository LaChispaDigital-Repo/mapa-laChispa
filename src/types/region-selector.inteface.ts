export interface RegionIndexEntry {
  id: number;
  name: string;
  slug: string;
  centroide: [number, number];
}

export interface UVProperties {
  id_region: number;
  nombre_region: string;
  id_provincia: string;
  nombre_provincia: string;
  id_comuna: string;
  nombre_comuna: string;
  id_uv: string;
  nombre_uv: string;
  numero_uv: string;
  [key: string]: any;
}

export interface UnidadVecinalFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: UVProperties;
}

export interface UnidadVecinalGeoJSON {
  type: "FeatureCollection";
  features: UnidadVecinalFeature[];
}

export interface DatosDemograficos {
  hogares?: number | null;
  rango_0_5?: number | null;
  rango_6_14?: number | null;
  rango_15_64?: number | null;
  rango_65_mas?: number | null;
  tot_hombres?: number | null;
  tot_mujeres?: number | null;
  tot_personas?: number | null;
}

export interface UnidadVecinal {
  id: string;
  nombre: string;
  numero: string;
  id_comuna: string;
  geometry: any; // GeoJSON Geometry
  datos_demograficos?: DatosDemograficos;
}

export interface Comuna {
  id_comuna: string;
  id_provincia: string;
  nombre_comuna: string;
  datos_demograficos?: DatosDemograficos;
  unidades_vecinales: UnidadVecinal[];
  juntas_vecinos?: JuntaVecinal[];
}

export interface Provincia {
  id_provincia: string;
  id_region: number;
  nombre_provincia: string;
  comunas: Comuna[];
}

export interface RegionGeoData {
  region: string;
  slug_region: string;
  centroide_region: [number, number];
  provincias: Provincia[];
}

export interface AdaptedGraphicData {
  name: string;
  value: number;
}

export interface JuntaVecinal {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  geometry?: GeoJSONPoint | null; // Objeto GeoJSON parseado, opcional
}

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitud, latitud]
}
