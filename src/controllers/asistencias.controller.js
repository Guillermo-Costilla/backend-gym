import {
  getAllAsistencias,
  getAsistenciaPorId,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
  getConcurrenciaActual,
  registrarAsistencia, getAsistenciasPorDia,
} from "../models/asistencias.model.js";
import { getClientePorDNI } from "../models/clientes.model.js";


// 🕒 Listar todas las asistencias
export async function listarAsistencias(req, res) {
  try {
    const asistencias = await getAllAsistencias();
    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error al listar asistencias:", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
}

// 🔍 Ver asistencia por ID
export async function verAsistencia(req, res) {
  try {
    const { id } = req.params;
    const asistencia = await getAsistenciaPorId(id);
    if (!asistencia) return res.status(404).json({ error: "Asistencia no encontrada" });
    res.json(asistencia);
  } catch (error) {
    console.error("❌ Error al obtener asistencia:", error);
    res.status(500).json({ error: "Error al obtener asistencia" });
  }
}

// 🟢 Registro público por DNI
// ➕ Crear nueva asistencia
export async function registrarAsistenciaPorDNI(req, res) {
  try {
    const { cliente_id, hora_ingreso, hora_salida } = req.body;

    if (!cliente_id || !hora_ingreso || !hora_salida) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const id = await crearAsistencia({ cliente_id, hora_ingreso, hora_salida });
    res.status(201).json({ id });
  } catch (error) {
    console.error("❌ Error al crear asistencia:", error);
    res.status(500).json({ error: "Error al crear asistencia" });
  }
}

// ✏️ Actualizar asistencia
export async function modificarAsistencia(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarAsistencia(id, cambios);
    if (actualizado === 0) return res.status(404).json({ error: "Asistencia no encontrada" });

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar asistencia:", error);
    res.status(500).json({ error: "Error al actualizar asistencia" });
  }
}

// ❌ Eliminar asistencia
export async function borrarAsistencia(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarAsistencia(id);
    if (eliminado === 0) return res.status(404).json({ error: "Asistencia no encontrada" });

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar asistencia:", error);
    res.status(500).json({ error: "Error al eliminar asistencia" });
  }
}

// 📊 Concurrencia actual
export async function verConcurrenciaActual(req, res) {
  try {
    const cantidad = await getConcurrenciaActual();
    res.json({ en_gimnasio: cantidad });
  } catch (error) {
    console.error("❌ Error al obtener concurrencia:", error);
    res.status(500).json({ error: "Error al obtener concurrencia actual" });
  }
}

export async function verAsistenciasPorDia(req, res) {
  try {
    let { fecha } = req.query;

    // 🧱 Sanitizar fecha: convertir a string YYYY-MM-DD si viene como Date u otro tipo
    if (!fecha) {
      fecha = new Date().toISOString().split("T")[0]; // default: hoy
    } else if (typeof fecha !== "string") {
      fecha = new Date(fecha).toISOString().split("T")[0];
    }

    const asistencias = await getAsistenciasPorDia(fecha);
    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error al obtener asistencias:", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
}
