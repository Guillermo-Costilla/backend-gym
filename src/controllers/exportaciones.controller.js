import { generarExcelPagos } from "../utils/excel.js";
import { getPagosPorMes } from "../models/pagos.model.js";
import { generarExcelVentas } from "../utils/excel.js";
import { getVentasPorMes } from "../models/ventas.model.js";

export async function exportarPagosPorMes(req, res) {
  try {
    const { mes } = req.query; // formato: "2025-10"
    if (!mes) return res.status(400).json({ error: "Mes requerido" });

    const pagos = await getPagosPorMes(mes); // debe incluir nombre del cliente
    const excelBuffer = await generarExcelPagos(pagos);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=pagos-${mes}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("❌ Error al exportar pagos:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
}

export async function exportarVentasPorMes(req, res) {
  try {
    const { mes } = req.query; // formato: "2025-10"
    if (!mes) return res.status(400).json({ error: "Mes requerido" });

    const ventas = await getVentasPorMes(mes);
    const excelBuffer = await generarExcelVentas(ventas);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=ventas-${mes}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("❌ Error al exportar ventas:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
}