import { create } from "zustand";
import type {
  RegionGeoData,
  RegionIndexEntry,
  Comuna,
  UnidadVecinal,
  DatosDemograficos,
} from "../types/region-selector.inteface";
import type { MapStore } from "./map-store.interface";
import { calculateCentroid } from "./calculate.centroid.helper";
import { fetchRegionGeoData } from "../utils/regionFetcher";
import { toGeoJSON } from "../adapters/supabase.adapter";
import {
  adaptDemographicDataForPieGraphic,
  adaptDemographicDataForBarGraphic,
} from "../adapters/demographicDataForGraphic.adapter";

// Variable externa para mantener una referencia al mapa de Leaflet
let mapInstance: any = null;

export const useMapStore = create<MapStore>((set, get) => ({
  juntasVecinos: [],
  filteredJuntasVecinos: [],
  selectedJuntaVecinal: null,
  
  // Métodos para manipular la referencia al mapa
  setMapInstance: (map: any) => {
    mapInstance = map;
    console.log("Mapa registrado en store", !!mapInstance);
    if (mapInstance) {
      console.log("Mapa disponible con métodos:", Object.getOwnPropertyNames(mapInstance));
      console.log("flyTo disponible:", typeof mapInstance.flyTo);
    }
  },
  
  getMapInstance: () => {
    console.log("Solicitando instancia de mapa:", !!mapInstance);
    return mapInstance;
  },
  
  // Método para centrar el mapa en coordenadas específicas
  flyToLocation: (lat: number, lng: number, zoom: number = 16) => {
    console.log("flyToLocation llamado con:", lat, lng, zoom);
    console.log("mapInstance disponible:", !!mapInstance);
    
    if (mapInstance) {
      console.log("Tipo de mapInstance:", typeof mapInstance);
      console.log("Métodos disponibles en mapa:", Object.getOwnPropertyNames(mapInstance));
      console.log("flyTo existe:", 'flyTo' in mapInstance);
      console.log("Tipo de flyTo:", typeof mapInstance.flyTo);
    }
    
    if (mapInstance && typeof mapInstance.flyTo === 'function') {
      console.log('Ejecutando flyTo a:', lat, lng, 'con zoom:', zoom);
      try {
        mapInstance.flyTo([lat, lng], zoom, {
          animate: true,
          duration: 1.5
        });
        console.log('flyTo ejecutado exitosamente');
        return true;
      } catch (error) {
        console.error('Error en flyTo:', error);
        return false;
      }
    } else {
      console.warn('No se puede volar: mapa no disponible o flyTo no es función');
      console.warn('mapInstance:', mapInstance);
      if (mapInstance) {
        console.warn('flyTo method:', mapInstance.flyTo);
      }
      return false;
    }
  },
  regionList: [],
  regionGeoJSON: null,
  selectedRegion: null,
  loading: false,
  position: [-33.048, -71.456],
  communeList: [],
  selectedProvince: null,
  selectedCommune: null,
  selectedUnidadVecinal: null,
  hoveredFeature: null,
  geoJsonVersion: 0,
  filtroNombreJJVV: "",
  regionRawData: null as RegionGeoData | null,
  // provincias: [],
  // comunas: [],
  // unidadesVecinales: [],
  demographicData: null,
  pieData: [],
  barData: [],

  setSelectedProvince: (province) =>
    set({ selectedProvince: province, selectedCommune: null, selectedUnidadVecinal: null }),
  setSelectedCommune: (commune: Comuna | null) => set({ selectedCommune: commune, selectedUnidadVecinal: null }),
  setSelectedUnidadVecinal: (uv: UnidadVecinal | null) => set({ selectedUnidadVecinal: uv }),
  setHoveredFeature: (feature) => set({ hoveredFeature: feature }),
  setJuntasVecinos: (data) => set({ juntasVecinos: data, filteredJuntasVecinos: data }),
  setFilteredJuntasVecinos: (juntas) => set({ filteredJuntasVecinos: juntas }),
  setSelectedJuntaVecinal: (junta) => set({ selectedJuntaVecinal: junta }),

  setRegionGeoJSON: (geoJSON) =>
    set((state) => ({
      regionGeoJSON: geoJSON,
      geoJsonVersion: state.geoJsonVersion + 1,
    })),

  setSelectedRegion: (region) => {
    set({
      selectedRegion: region,
      selectedProvince: null,
      selectedCommune: null,
      selectedUnidadVecinal: null,
      position: region?.centroide || [-33.048, -71.456],
    });
  },

  setLoading: (loading) => set({ loading }),
  setRegionList: (regions) => set({ regionList: regions }),
  setPosition: (position) => set({ position }),
  setFiltroNombreJJVV: (filtro) => {
    set({ filtroNombreJJVV: filtro });
    // Actualizar juntas filtradas cuando cambia el filtro
    const { juntasVecinos } = get();
    if (filtro && filtro.trim() !== "") {
      const filtered = juntasVecinos.filter((junta) =>
        junta.nombre.toLowerCase().includes(filtro.toLowerCase().trim())
      );
      set({ filteredJuntasVecinos: filtered });
    } else {
      set({ filteredJuntasVecinos: juntasVecinos });
    }
  },
  
  getFilteredJuntasVecinos: () => {
    const { filtroNombreJJVV, juntasVecinos } = get();
    if (!filtroNombreJJVV || filtroNombreJJVV.trim() === "") {
      return juntasVecinos;
    }
    return juntasVecinos.filter((junta) =>
      junta.nombre.toLowerCase().includes(filtroNombreJJVV.toLowerCase().trim())
    );
  },

  setDemographicData: (data: DatosDemograficos | null) => {
    set({
      demographicData: data,
      pieData: data ? adaptDemographicDataForPieGraphic(data) : [],
      barData: data ? adaptDemographicDataForBarGraphic(data) : [],
    });
  },

  // Getter optimizado para obtener provincias de la región actual
  getProvincias: () => {
    const { regionRawData } = get();
    return regionRawData?.provincias || [];
  },

  // Getter para obtener comunas filtradas por provincia
  getComunas: () => {
    const { regionRawData, selectedProvince } = get();
    if (!regionRawData) return [];

    if (selectedProvince) {
      const provincia = regionRawData.provincias.find((p) => p.id_provincia === selectedProvince);
      return provincia?.comunas || [];
    }

    return regionRawData.provincias.flatMap((p) => p.comunas);
  },

  // Getter para obtener unidades vecinales filtradas
  getUnidadesVecinales: () => {
    const { regionRawData, selectedProvince, selectedCommune } = get();
    if (!regionRawData) return [];

    let comunas = regionRawData.provincias.flatMap((p) => p.comunas);

    if (selectedProvince) {
      const provincia = regionRawData.provincias.find((p) => p.id_provincia === selectedProvince);
      comunas = provincia?.comunas || [];
    }

    if (selectedCommune) {
      comunas = comunas.filter((c) => c.id_comuna === selectedCommune.id_comuna);
    }
    return comunas.flatMap((c) => c.unidades_vecinales);
  },

  // FILTROS DE UNIDADES VECINALES PARA EL MAPA

  getFilteredUVFeatures: () => {
    const { regionGeoJSON, selectedCommune, selectedUnidadVecinal, selectedProvince } = get();
    if (!regionGeoJSON) return [];

    let features = regionGeoJSON.features;

    if (selectedProvince) {
      features = features.filter((f) => f.properties.id_provincia === selectedProvince);
    }
    if (selectedCommune) {
      features = features.filter((f) => f.properties.id_comuna === selectedCommune.id_comuna);
    }
    if (selectedUnidadVecinal) {
      features = features.filter((f) => f.properties.nombre_uv === selectedUnidadVecinal.nombre);
    }

    return features;
  },

  loadRegions: async () => {
    const { setRegionList, setLoading } = get();
    setLoading(true);
    try {
      const res = await fetch("/geojson/regiones.json");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data: RegionIndexEntry[] = await res.json();
      setRegionList(data);
    } catch (error) {
      console.error("Error cargando regiones:", error);
    } finally {
      setLoading(false);
    }
  },

  loadRegionGeoJSON: async () => {
    const { selectedRegion, setLoading } = get();
    setLoading(true);
    try {
      if (!selectedRegion) throw new Error("No region selected");

      // Obtener datos de Supabase usando el adapter
      const rawData = await fetchRegionGeoData(selectedRegion.slug);
      console.log("Datos de Supabase adaptados:", rawData);

      // Convertir a GeoJSON usando el adapter
      const geoJSON = toGeoJSON(rawData, selectedRegion.id, selectedRegion.name);

      set({
        regionGeoJSON: geoJSON,
        regionRawData: rawData,
        geoJsonVersion: get().geoJsonVersion + 1,
      });
    } catch (error) {
      console.error("Error cargando datos de la región desde Supabase:", error);
      set({ regionGeoJSON: null, regionRawData: null });
    } finally {
      setLoading(false);
    }
  },

  clearFilters: () => () =>
    set({
      selectedRegion: null,
      selectedProvince: null,
      selectedCommune: null,
      selectedUnidadVecinal: null,
      selectedJuntaVecinal: null,
      regionGeoJSON: null,
      regionRawData: null,
      juntasVecinos: [],
      filteredJuntasVecinos: [],
      filtroNombreJJVV: "",
      position: [-33.048, -71.456],
      demographicData: null,
      pieData: [],
      barData: [],
    }),
}));

export { calculateCentroid };
