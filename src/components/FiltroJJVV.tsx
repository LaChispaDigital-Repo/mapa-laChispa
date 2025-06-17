import React from "react";
import { useMapStore } from "../store/useMapStore";

export const FiltroJJVV: React.FC = () => {
  const filtroNombreJJVV = useMapStore((state) => state.filtroNombreJJVV);
  const setFiltroNombreJJVV = useMapStore((state) => state.setFiltroNombreJJVV);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroNombreJJVV(event.target.value);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        id="filtro-jjvv-nombre"
        placeholder="Buscar JJVV por nombre..."
        value={filtroNombreJJVV}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400"
      />
    </div>
  );
};
