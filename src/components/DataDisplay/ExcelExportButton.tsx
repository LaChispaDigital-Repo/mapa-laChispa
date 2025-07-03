import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { DatosDemograficos } from "../../types/interfaces";

interface ExcelExportButtonProps {
  data: DatosDemograficos;
  fileName?: string;
  buttonLabel?: string;
  title?: string;
}

export const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  data,
  title = "",
  fileName = `datos-demograficos-${title}.xlsx`,
  buttonLabel = "Exportar datos a Excel",
}) => {
  const handleExport = async () => {
    try {
      // 1. Crear nuevo workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "La Chispa Digital";
      workbook.created = new Date();

      // 2. Añadir worksheet
      const worksheet = workbook.addWorksheet(`Datos Demográficos de ${title}`);

      // 3. Definir estilos
      const titleStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, size: 16, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" }, // Azul corporativo
        },
        alignment: { horizontal: "center", vertical: "middle" },
      };

      const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "70AD47" }, // Verde corporativo
        },
        border: {
          top: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
        },
      };

      const dataStyle: Partial<ExcelJS.Style> = {
        font: { size: 12 },
        border: {
          left: { style: "thin", color: { argb: "D3D3D3" } },
          right: { style: "thin", color: { argb: "D3D3D3" } },
          bottom: { style: "thin", color: { argb: "D3D3D3" } },
        },
      };

      // 4. Definir columnas (esto crea las columnas A y B)
      worksheet.columns = [
        { header: "Indicador", key: "indicador", width: 30 },
        { header: "Valor", key: "valor", width: 20 },
      ];

      // 5. Añadir título
      worksheet.mergeCells("A1:B1"); // NOTA: POR ALGUNA RAZÓN NO FUNCIONA EL MERGE CELLS
      const titleRow = worksheet.getRow(1);
      titleRow.values = [`Datos Demográficos de ${title}`];
      titleRow.height = 25;
      titleRow.eachCell((cell) => {
        cell.style = titleStyle;
      });

      // 6. Añadir encabezados
      const headerRow = worksheet.getRow(2);
      headerRow.values = ["Indicador", "Valor"];
      headerRow.eachCell((cell) => {
        cell.style = headerStyle;
      });

      // 7. Añadir datos a partir de la fila 3
      const rows = [
        ["Total de hogares", data.hogares ?? "N/D"],
        ["Población 0-5 años", data.rango_0_5 ?? "N/D"],
        ["Población 6-14 años", data.rango_6_14 ?? "N/D"],
        ["Población 15-64 años", data.rango_15_64 ?? "N/D"],
        ["Población 65+ años", data.rango_65_mas ?? "N/D"],
        ["Total hombres", data.tot_hombres ?? "N/D"],
        ["Total mujeres", data.tot_mujeres ?? "N/D"],
        ["Total población", data.tot_personas ?? "N/D"],
      ];

      rows.forEach((row) => {
        const newRow = worksheet.addRow(row);
        newRow.eachCell((cell) => {
          cell.style = dataStyle;
          if (typeof cell.value === "number") {
            cell.numFmt = "#,##0";
          }
        });
      });

      // 8. Ajustar ancho de columnas
      worksheet.columns = [
        { key: "name", width: 30 },
        { key: "value", width: 20 },
      ];

      // 9. Generar y descargar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("Ocurrió un error al generar el archivo Excel");
    }
  };

  return (
    <button onClick={handleExport} className={`btn btn-primary`}>
      {buttonLabel}
    </button>
  );
};
