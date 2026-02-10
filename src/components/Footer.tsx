import { useMapStore } from "../store/useMapStore";
import { ExcelExportButton } from "./DataDisplay/ExcelExportButton";

export const Footer: React.FC = () => {
  const demographicData = useMapStore((state) => state.demographicData);
  const selectedCommune = useMapStore((state) => state.selectedCommune);
  const selectedUnidadVecinal = useMapStore((state) => state.selectedUnidadVecinal);
  const sourceDate = useMapStore((state) => state.sourceDate);
  const extractDate = useMapStore((state) => state.extractDate);

  const title = selectedUnidadVecinal
    ? `la Unidad Vecinal ${selectedUnidadVecinal.nombre} de la comuna de ${selectedCommune?.nombre_comuna}`
    : selectedCommune
    ? `la comuna ${selectedCommune.nombre_comuna}`
    : "";

  // Función para formatear la fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <footer className="footer sm:footer-horizontal footer-horizontal footer-center bg-base-300 text-base-content p-4 grid grid-cols-3 gap-4">
      <div className="">
        <p>Fecha de los datos: {formatDate(sourceDate)}</p>
        <span>Fecha última actualización de la página: {formatDate(extractDate)}</span>
        <span>Fuente: Instituto Nacional de Estadisticas</span>
      </div>
      <p>© 2025 La Chispa Digital. Todos los derechos reservados.</p>
      <div className="col-span-1 ">{demographicData && <ExcelExportButton data={demographicData} title={title} />}</div>
    </footer>
  );
};
