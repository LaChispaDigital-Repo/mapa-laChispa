import { useMapStore } from "../store/useMapStore";
import { CustomPieChart } from "./CustomPieChart";
import { CustomBarChart } from "./CustomBarChart";
import { Loader } from "./common/Loader";

export const ShowInfo = () => {
  const selectedCommuneData = useMapStore((state) => state.selectedCommuneData);
  const selectedUnidadVecinalData = useMapStore((state) => state.selectedUnidadVecinalData);
  const clearFilters = useMapStore((state) => state.clearFilters);
  const loading = useMapStore((state) => state.loading);

  if (!selectedUnidadVecinalData && !selectedCommuneData?.metadata?.totalesGenerales) {
    clearFilters();
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-700">
        <h1 className="text-2xl font-semibold">Selecciona una unidad vecinal o comuna válida</h1>
        <p className="m-5 p-5 text-gray-500 border border-dashed">Aquí se mostrará la información demográfica.</p>
      </div>
    );
  }

  const isUV = !!selectedUnidadVecinalData;
  const source = isUV ? selectedUnidadVecinalData : selectedCommuneData?.metadata.totalesGenerales;

  if (!source) return null;

  const totalPeople = source["Número total de personas"];

  const pieData = Object.entries(source)
    .filter(([key]) => key === "Total de Hombres" || key === "Total de Mujeres")
    .map(([name, value]) => ({ name, value: Number(value) }));

  const barData = Object.entries(source)
    .filter(([key]) =>
      [
        "Total de personas de 0 a 5 años",
        "Total de personas de 6 a 14 años",
        "Total de personas de 15 a 64 años",
        "Total de personas de 65 y más años",
      ].includes(key)
    )
    .map(([name, value]) => ({ name, value: Number(value) }));

  const title = isUV
    ? `Información de Unidad Vecinal: ${selectedUnidadVecinalData["NOMBRE UNIDAD VECINAL"]}`
    : `Información sobre la comuna de: ${selectedCommuneData?.metadata?.t_com_nom}`;

  // useEffect(() => {}, [selectedCommuneData]);
  if (loading) {
    return <Loader center size="lg" text="AHORAAAAAAAAAAAAA" />;
    {
    }
  }
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-black text-center text-2xl py-5 my-5">{title}</h1>
      <div className="grid grid-cols-3 md:grid-cols-3 w-full px-5 gap-6">
        <div className="flex flex-col gap-4 justify-center items-center">
          <strong className="text-xl md:text-2xl font-semibold text-gray-700 text-center">Total de personas</strong>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">{totalPeople}</h1>
        </div>
        <div className="col-span-2">
          <CustomPieChart data={pieData} key={isUV ? "pie-uv" : `pie-${selectedCommuneData?.metadata.t_com}`} />
        </div>
        <div className="col-span-3">
          <CustomBarChart data={barData} key={isUV ? "bar-uv" : `bar-${selectedCommuneData?.metadata.t_com}`} />
        </div>
      </div>
    </div>
  );
};
