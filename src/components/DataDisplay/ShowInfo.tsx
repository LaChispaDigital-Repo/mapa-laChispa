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
  const totalPeople = useMapStore((state) => state.demographicData?.tot_personas || null);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const selectedCommune = useMapStore((state) => state.selectedCommune);

  if (!selectedCommune)
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-700">
        <h1 className="text-2xl font-semibold">Seleccione una comuna para ver la información demográfica</h1>
      </div>
    );

  if (!demographicData || !totalPeople) {
    clearFilters();
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-700">
        <h1 className="text-2xl font-semibold">Actualmente no existen datos para la selección</h1>
      </div>
    );
  }

  const isUV = !!selectedUnidadVecinal;
  const title = isUV
    ? `Información de Unidad Vecinal: ${selectedUnidadVecinal?.nombre}`
    : `Información sobre la comuna de: ${selectedCommune?.nombre_comuna}`;

  if (loading) {
    return <Loader center />;
  }
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-black text-center text-1xl lg:py-1 sm:py-1 sm:my-1">{title}</h1>
      <div className="grid not-[]:w-full px-5 gap-5">
        <div className="grid grid-cols-1">
          <div className="flex flex-col gap-2 justify-center items-center">
            <strong className="text-1xl font-semibold text-gray-700 text-center">Total de personas</strong>
            <h1 className="text-2xl font-bold text-blue-600">{totalPeople}</h1>
          </div>
          <div className="">
            <CustomPieChart data={pieData} />
          </div>
        </div>
        <div className="">
          <CustomBarChart data={barData} />
        </div>
      </div>
    </div>
  );
};
