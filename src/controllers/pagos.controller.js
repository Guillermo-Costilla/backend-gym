import {
  getAllPagos,
  getPagoPorId,
  crearPago,
  actualizarPago,
  eliminarPago,
  getPagosVencidos,
  getPagosProximos,
  getIngresosMensuales,
} from "../models/pagos.model.js";
import { getClientePorId } from "../models/clientes.model.js";
import { enviarEmail } from "../utils/mailer.js";

// 💳 Listar todos los pagos
export async function listarPagos(req, res) {
  try {
    const pagos = await getAllPagos();
    res.json(pagos);
  } catch (error) {
    console.error("❌ Error al listar pagos:", error);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
}

// 🔍 Ver pago por ID
export async function verPago(req, res) {
  try {
    const { id } = req.params;
    const pago = await getPagoPorId(id);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });
    res.json(pago);
  } catch (error) {
    console.error("❌ Error al obtener pago:", error);
    res.status(500).json({ error: "Error al obtener pago" });
  }
}

// ➕ Crear nuevo pago
export async function crearNuevoPago(req, res) {
  try {
    const { cliente_id, monto, tipo, fecha_pago, pagado } = req.body;

    if (!cliente_id || !monto || !tipo || !fecha_pago) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const id = await crearPago({ cliente_id, monto, tipo, fecha_pago, pagado });

    const cliente = await getClientePorId(cliente_id);
    if (cliente?.email) {
      await enviarEmail({
        to: cliente.email,
        subject: "Pago registrado",
        html: `
          <h2>Hola ${cliente.nombre} 👋</h2>
          <p>Tu pago de <strong>$${monto}</strong> (${tipo}) fue registrado correctamente el <strong>${fecha_pago}</strong>.</p>
          <p>Gracias por mantenerte al día 💪</p>
        `,
      });
    }

    res.status(201).json({ id });
  } catch (error) {
    console.error("❌ Error al crear pago:", error);
    res.status(500).json({ error: "Error al crear pago" });
  }
}


// ✏️ Actualizar pago
export async function modificarPago(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarPago(id, cambios);
    if (actualizado === 0) return res.status(404).json({ error: "Pago no encontrado" });

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar pago:", error);
    res.status(500).json({ error: "Error al actualizar pago" });
  }
}

// ❌ Eliminar pago
export async function borrarPago(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarPago(id);
    if (eliminado === 0) return res.status(404).json({ error: "Pago no encontrado" });

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar pago:", error);
    res.status(500).json({ error: "Error al eliminar pago" });
  }
}

// 🔴 Pagos vencidos
export async function listarPagosVencidos(req, res) {
  try {
    const vencidos = await getPagosVencidos();
    res.json(vencidos);
  } catch (error) {
    console.error("❌ Error al obtener pagos vencidos:", error);
    res.status(500).json({ error: "Error al obtener pagos vencidos" });
  }
}

// 🟡 Pagos próximos
export async function listarPagosProximos(req, res) {
  try {
    const dias = parseInt(req.query.dias) || 7;
    const proximos = await getPagosProximos(dias);
    res.json(proximos);
  } catch (error) {
    console.error("❌ Error al obtener pagos próximos:", error);
    res.status(500).json({ error: "Error al obtener pagos próximos" });
  }
}

// 📊 Métrica mensual
export async function verIngresosMensuales(req, res) {
  try {
    const ingresos = await getIngresosMensuales();
    res.json(ingresos);
  } catch (error) {
    console.error("❌ Error al obtener ingresos mensuales:", error);
    res.status(500).json({ error: "Error al obtener métricas" });
  }
}