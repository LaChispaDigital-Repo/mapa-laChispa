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

export const useMapStore = create<MapStore>((set, get) => ({
  juntasVecinos: [],
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
  setJuntasVecinos: (data) => set({ juntasVecinos: data }),

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
  setFiltroNombreJJVV: (filtro) => set({ filtroNombreJJVV: filtro }),

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
      regionGeoJSON: null,
      regionRawData: null,
      juntasVecinos: [],
      filtroNombreJJVV: "",
      position: [-33.048, -71.456],
      demographicData: null,
      pieData: [],
      barData: [],
    }),
}));

export { calculateCentroid };
