import { useMapStore } from "../../store/useMapStore";
import { CustomPieChart } from "./Charts/CustomPieChart";
import { CustomBarChart } from "./Charts/CustomBarChart";
import { Loader } from "../common/Loader";

export const ShowInfo = () => {
  const clearFilters = useMapStore((state) => state.clearFilters);
  const loading = useMapStore((state) => state.loading);
  const demographicData = useMapStore((state) => state.demographicData);
  const pieData = useMapStore((state) => state.pieData);
  const barData = useMapStore((state) => state.barData);
  const totalPeople = useMapStore((state) => state.demographicData?.tot_personas || 0);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const selectedCommune = useMapStore((state) => state.selectedCommune);

  if (!demographicData) {
    clearFilters();
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-700">
        <h1 className="text-2xl font-semibold">Selecciona una unidad vecinal o comuna válida</h1>
        <p className="m-5 p-5 text-gray-500 border border-dashed">Aquí se mostrará la información demográfica.</p>
      </div>
    );
  }

  const isUV = !!selectedUnidadVecinal;
  const title = isUV
    ? `Información de Unidad Vecinal: ${selectedUnidadVecinal?.nombre}`
    : `Información sobre la comuna de: ${selectedCommune?.nombre_comuna}`;

  if (loading) {
    return <Loader center text="AHORAAAAAAAAAAAAA" />;
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
          <CustomPieChart data={pieData} />
        </div>
        <div className="col-span-3">
          <CustomBarChart data={barData} />
        </div>
      </div>
    </div>
  );
};
