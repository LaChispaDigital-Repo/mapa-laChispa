import { supabase } from "../supabaseClient";
import { adaptRegionData } from "../adapters/supabase.adapter";

export async function fetchRegionGeoData(slug: string) {
  const response = await supabase.rpc("get_datos_por_region", { region_slug: slug });
  const rawData = response.data;

  if (!rawData) throw new Error("No data returned from Supabase");

  return adaptRegionData(rawData);
}
