import type {
  RegionIndexEntry,
  UnidadVecinalFeature,
  UnidadVecinalGeoJSON,
  RegionGeoData,
  Comuna,
  UnidadVecinal,
  Provincia,
  DatosDemograficos,
  JuntaVecinal,
} from "../types/region-selector.inteface";

// Interfaz para el store del mapa
export interface MapStore {
  regionList: RegionIndexEntry[];
  regionGeoJSON: UnidadVecinalGeoJSON | null;
  selectedRegion: RegionIndexEntry | null;
  loading: boolean;
  position: [number, number];
  selectedProvince: string | null;
  selectedCommune: Comuna | null;
  selectedUnidadVecinal: UnidadVecinal | null;
  demographicData: DatosDemograficos | null;
  hoveredFeature: UnidadVecinalFeature | null;
  geoJsonVersion: number;
  juntasVecinos: JuntaVecinal[];
  filteredJuntasVecinos: JuntaVecinal[];
  selectedJuntaVecinal: JuntaVecinal | null;
  filtroNombreJJVV: string;
  regionRawData: RegionGeoData | null;
  // provincias: Provincia[];
  // comunas: Comuna[];
  // unidadesVecinales: UnidadVecinal[];  
  pieData: any[];
  barData: any[];

  // Getters

  getProvincias: () => Provincia[];
  getComunas: () => Comuna[];
  getUnidadesVecinales: () => UnidadVecinal[];
  getFilteredUVFeatures: () => UnidadVecinalFeature[];

  // Setters

  setSelectedProvince: (province: string | null) => void;
  setSelectedCommune: (commune: Comuna | null) => void;
  setSelectedUnidadVecinal: (uv: UnidadVecinal | null) => void;
  setHoveredFeature: (feature: UnidadVecinalFeature | null) => void;
  setJuntasVecinos: (data: JuntaVecinal[]) => void;
  setDemographicData: (data: DatosDemograficos | null) => void;
  setRegionGeoJSON: (geoJSON: UnidadVecinalGeoJSON | null) => void;
  setSelectedRegion: (region: RegionIndexEntry | null) => void;
  setLoading: (loading: boolean) => void;
  setRegionList: (regions: RegionIndexEntry[]) => void;
  setPosition: (position: [number, number]) => void;
  setFiltroNombreJJVV: (filtro: string) => void;
  setFilteredJuntasVecinos: (juntas: JuntaVecinal[]) => void;
  setSelectedJuntaVecinal: (junta: JuntaVecinal | null) => void;
  getFilteredJuntasVecinos: () => JuntaVecinal[];

  // Métodos para manipular el mapa directamente
  setMapInstance: (map: any) => void;
  getMapInstance: () => any;
  flyToLocation: (lat: number, lng: number, zoom?: number) => boolean;

  // Async Actions
  loadRegions: () => Promise<void>;
  loadRegionGeoJSON: () => Promise<void>;
  // loadJuntasVecinos: (communCode: string) => Promise<void>;

  clearFilters(): () => void;
}
