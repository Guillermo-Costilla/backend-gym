import {
  getAllVentas,
  getVentaPorId,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  getVentasPorDia,
  getProductoMasVendido,
} from "../models/ventas.models.js";
import { enviarEmail } from "../utils/mailer.js";

// 🧾 Listar todas las ventas
export async function listarVentas(req, res) {
  try {
    const ventas = await getAllVentas();
    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al listar ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
}

// 🔍 Ver venta por ID
export async function verVenta(req, res) {
  try {
    const { id } = req.params;
    const venta = await getVentaPorId(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    console.error("❌ Error al obtener venta:", error);
    res.status(500).json({ error: "Error al obtener venta" });
  }
}

// ➕ Crear nueva venta
export async function crearNuevaVenta(req, res) {
  const { cliente_id, producto_id, cantidad } = req.body;
  const id = await registrarVenta({ cliente_id, producto_id, cantidad });

  const cliente = await getClientePorId(cliente_id);
  const producto = await getProductoPorId(producto_id);

  await enviarEmail({
    to: cliente.email,
    subject: "Compra confirmada",
    html: `<p>Hola ${cliente.nombre}, compraste ${cantidad} unidad(es) de ${producto.nombre}. ¡Gracias por tu compra!</p>`,
  });

  res.status(201).json({ id });
}


// ✏️ Actualizar venta
export async function modificarVenta(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarVenta(id, cambios);
    if (actualizado === 0) return res.status(404).json({ error: "Venta no encontrada" });

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar venta:", error);
    res.status(500).json({ error: "Error al actualizar venta" });
  }
}

// ❌ Eliminar venta
export async function borrarVenta(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarVenta(id);
    if (eliminado === 0) return res.status(404).json({ error: "Venta no encontrada" });

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar venta" });
  }
}

// 📊 Ventas por día
export async function verVentasPorDia(req, res) {
  try {
    const ventas = await getVentasPorDia();
    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas por día:", error);
    res.status(500).json({ error: "Error al obtener métricas diarias" });
  }
}

// 🥇 Producto más vendido
export async function verProductoMasVendido(req, res) {
  try {
    const producto = await getProductoMasVendido();
    res.json(producto);
  } catch (error) {
    console.error("❌ Error al obtener producto más vendido:", error);
    res.status(500).json({ error: "Error al obtener métrica de producto más vendido" });
  }
}