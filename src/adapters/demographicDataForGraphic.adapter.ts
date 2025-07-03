import type { AdaptedGraphicData, DatosDemograficos } from "../types/interfaces";

export function adaptDemographicDataForPieGraphic(data: DatosDemograficos): AdaptedGraphicData[] {
  try {
    console.log("Transforming demographic data for pie graphic:", data);
    const adaptedData: AdaptedGraphicData[] = [];
    data.tot_hombres && adaptedData.push({ name: "Total de Hombres", value: data.tot_hombres });
    data.tot_mujeres && adaptedData.push({ name: "Total de Mujeres", value: data.tot_mujeres });
    console.log(adaptedData);
    return adaptedData;
  } catch (error) {
    console.error("Error adapting demographic data for pie graphic:", error);
    return [];
  }
}

export function adaptDemographicDataForBarGraphic(data: DatosDemograficos): AdaptedGraphicData[] {
  try {
    console.log("Transforming demographic data for bar graphic:", data);
    const adaptedData: AdaptedGraphicData[] = [];
    data.rango_0_5 && adaptedData.push({ name: "0 a 5 años", value: data.rango_0_5 });
    data.rango_6_14 && adaptedData.push({ name: "6 a 14 años", value: data.rango_6_14 });
    data.rango_15_64 && adaptedData.push({ name: "15 a 64 años", value: data.rango_15_64 });
    data.rango_65_mas && adaptedData.push({ name: "65 y más años", value: data.rango_65_mas });
    console.log(adaptedData);
    return adaptedData;
  } catch (error) {
    console.error("Error adapting demographic data for bar graphic:", error);
    return [];
  }
}
