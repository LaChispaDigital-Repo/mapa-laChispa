import { supabase } from "../supabaseClient";
import { adaptRegionData } from "../adapters/supabase.adapter";

export async function fetchRegionGeoData(slug: string) {
  try {
    const response = await supabase.rpc("get_datos_por_region", { region_slug: slug });
    const rawData = response.data;
    return adaptRegionData(rawData);
  } catch (error) {
    throw new Error("No data returned from Supabase");
  }
}

export async function fetchRegions() {
  try {
    const response = await supabase.rpc("get_regions");
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error("No data returned from Supabase");
  }
}
