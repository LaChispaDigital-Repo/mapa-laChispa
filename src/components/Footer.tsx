import { useMapStore } from "../store/useMapStore";
import { ExcelExportButton } from "./DataDisplay/ExcelExportButton";

export const Footer: React.FC = () => {
  const demographicData = useMapStore((state) => state.demographicData);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);

  const title = selectedUnidadVecinal
    ? `la Unidad Vecinal ${selectedUnidadVecinal.nombre} de la comuna de ${selectedCommune?.nombre_comuna}`
    : selectedCommune
    ? `la comuna ${selectedCommune.nombre_comuna}`
    : "";

  return (
    <footer className="footer sm:footer-horizontal footer-horizontal footer-center bg-base-300 text-base-content p-4 grid grid-cols-3 gap-4">
      <div className="">
        {/* Incluir fecha de datos en la database */}
        <p>Fecha de datos:</p>
        {/* Incluir fecha última actualización en la database */}
        <span>Fecha última actualización:</span>
      </div>
      <p>© 2025 La Chispa Digital. Todos los derechos reservados.</p>
      <div className="col-span-1 ">{demographicData && <ExcelExportButton data={demographicData} title={title} />}</div>
    </footer>
  );
};
