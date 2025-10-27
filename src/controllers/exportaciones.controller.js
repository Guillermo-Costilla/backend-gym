import { generarExcelPagos } from "../utils/excel.js";
import { getPagosPorMes } from "../models/pagos.model.js";
import { generarExcelVentas } from "../utils/excel.js";
import { getVentasPorMes } from "../models/ventas.models.js";

export async function exportarPagosPorMes(req, res) {
  try {
    const { mes } = req.query; // formato: "2025-10"
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: "Mes requerido en formato YYYY-MM" });
    }

    const pagos = await getPagosPorMes(mes);
    const excelBuffer = await generarExcelPagos(pagos);

    const nombreArchivo = `pagos-${mes}`.replace(/[^a-zA-Z0-9-_]/g, "_");

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}.xlsx"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("❌ Error al exportar pagos:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
}

export async function exportarVentasPorMes(req, res) {
  try {
    const { mes } = req.query; // formato: "2025-10"
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: "Mes requerido en formato YYYY-MM" });
    }

    const ventas = await getVentasPorMes(mes);
    const excelBuffer = await generarExcelVentas(ventas);

    const nombreArchivo = `ventas-${mes}`.replace(/[^a-zA-Z0-9-_]/g, "_");

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}.xlsx"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("❌ Error al exportar ventas:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
}