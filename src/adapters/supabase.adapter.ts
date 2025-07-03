import type { RegionGeoData } from "../types/interfaces";
import type { UnidadVecinalGeoJSON, UVProperties } from "../types/interfaces";

/**
 * Adapta los datos crudos de Supabase a la estructura esperada por el frontend
 */
export function adaptRegionData(rawData: any): RegionGeoData {
  return {
    region: rawData.region,
    slug_region: rawData.slug_region,
    centroide_region: rawData.centroide_region,
    provincias: rawData.provincias.map(adaptProvincia),
  };
}

function adaptProvincia(provincia: any) {
  return {
    id_provincia: provincia.id_provincia,
    nombre_provincia: provincia.nombre_provincia,
    comunas: provincia.comunas.map(adaptComuna),
  };
}

function adaptComuna(comuna: any) {
  return {
    id_comuna: comuna.id_comuna,
    nombre_comuna: comuna.nombre_comuna,
    datos_demograficos: adaptDatosDemograficos(comuna.datos_demograficos),
    unidades_vecinales: comuna.unidades_vecinales.map(adaptUnidadVecinal),
    juntas_vecinos: Array.isArray(comuna.juntas_vecinos) ? comuna.juntas_vecinos.map(adaptJuntaVecinal) : [], // Asegurarse de que siempre sea un array
  };
}

function adaptUnidadVecinal(uv: any) {
  return {
    id: uv.id,
    nombre: uv.nombre,
    numero: uv.numero,
    geometry: uv.geometry,
    datos_demograficos: adaptDatosDemograficos(uv.datos_demograficos),
  };
}

function adaptJuntaVecinal(junta: any) {
  // Añadir log para depurar los campos disponibles en los datos crudos
  console.log("Datos crudos de junta:", {
    id: junta.id,
    nombre: junta.nombre,
    lat: junta.lat,
    lng: junta.lng,
    lon: junta.lon,
    campos_disponibles: Object.keys(junta),
  });

  return {
    id: junta.id,
    lat: junta.lat,
    lng: junta.lng, // Se usa junta.lng basado en tus cambios locales
    nombre: junta.nombre,
    direccion: junta.direccion,
    geometry: junta.geometry || null,
  };
}

function adaptDatosDemograficos(datos: any) {
  return {
    tot_personas: datos?.tot_personas || null,
    tot_hombres: datos?.tot_hombres || null,
    tot_mujeres: datos?.tot_mujeres || null,
    rango_0_5: datos?.rango_0_5 || null,
    rango_6_14: datos?.rango_6_14 || null,
    rango_15_64: datos?.rango_15_64 || null,
    rango_65_mas: datos?.rango_65_mas || null,
    hogares: datos?.hogares || null,
    viviendas: datos?.viviendas || null,
  };
}

/**
 * Convierte los datos de región a GeoJSON
 */
export function toGeoJSON(rawData: RegionGeoData, regionId: number, regionName: string): UnidadVecinalGeoJSON {
  const features = rawData.provincias.flatMap((provincia) =>
    provincia.comunas.flatMap((comuna) =>
      comuna.unidades_vecinales.map((uv) => ({
        type: "Feature" as const,
        geometry: uv.geometry,
        properties: {
          id_region: regionId,
          nombre_region: regionName,
          id_provincia: provincia.id_provincia,
          nombre_provincia: provincia.nombre_provincia,
          id_comuna: comuna.id_comuna,
          nombre_comuna: comuna.nombre_comuna,
          id_uv: uv.id,
          nombre_uv: uv.nombre,
          numero_uv: uv.numero,
          ...uv.datos_demograficos,
        } as UVProperties,
      }))
    )
  );

  return {
    type: "FeatureCollection",
    features,
  };
}
