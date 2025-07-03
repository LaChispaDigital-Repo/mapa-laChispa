import type { UVProperties, UnidadVecinal } from "../types/interfaces";

export const mapPropsToUnidadVecinalAdapter = (props: UVProperties): UnidadVecinal => ({
  id: props.id_uv,
  nombre: props.nombre_uv,
  numero: props.numero_uv,
  id_comuna: props.id_comuna,
  geometry: null,
  datos_demograficos: {
    tot_personas: props.tot_personas ?? null,
    tot_hombres: props.tot_hombres ?? null,
    tot_mujeres: props.tot_mujeres ?? null,
    rango_0_5: props.rango_0_5 ?? null,
    rango_6_14: props.rango_6_14 ?? null,
    rango_15_64: props.rango_15_64 ?? null,
    rango_65_mas: props.rango_65_mas ?? null,
    hogares: props.hogares ?? null,
  },
});
