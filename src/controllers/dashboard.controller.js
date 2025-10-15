import { getClientesActivos, getNuevosClientesPorMes } from "../models/clientes.model.js";
import { getAsistenciasPorDia } from "../models/asistencias.model.js";
import { getVentasDelDia, getProductoMasVendido, getIngresosDelDia } from "../models/ventas.models.js";

export async function verDashboard(req, res) {
  try {
    const fecha = req.query.fecha || new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD

    const [activos, nuevos, asistencias, ventas, ingresos, topProducto] = await Promise.all([
      getClientesActivos(),
      getNuevosClientesPorMes(),
      getAsistenciasPorDia(fecha),
      getVentasDelDia(fecha),
      getIngresosDelDia(fecha),
      getProductoMasVendido(),
    ]);

    res.json({
      fecha,
      clientes_activos: activos,
      nuevos_clientes_mes: nuevos,
      asistencias_hoy: asistencias,
      ventas_hoy: ventas,
      ingresos_hoy: ingresos,
      producto_top: topProducto,
    });
  } catch (error) {
    console.error("❌ Error en dashboard:", error);
    res.status(500).json({ error: "Error al obtener métricas del dashboard" });
  }
}