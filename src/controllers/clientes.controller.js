import {
  getAllClientes,
  getClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  getClientesActivos,
  getNuevosClientesPorMes,
  getFrecuenciaPorCliente,

} from "../models/clientes.model.js";
import { clienteSchema } from "../schemas/clientes.schema.js";
import { enviarEmail } from "../utils/mailer.js";


// 🧍 Listar todos los clientes
export async function listarClientes(req, res) {
  try {
    const clientes = await getAllClientes();
    res.json(clientes);
  } catch (error) {
    console.error("❌ Error al listar clientes:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
}

// 🔍 Ver cliente por ID
export async function verCliente(req, res) {
  try {
    const { id } = req.params;
    const cliente = await getClientePorId(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
}

// ➕ Crear cliente^
export async function crearNuevoCliente(req, res) {
  const parseado = clienteSchema.safeParse(req.body)
  if (!parseado.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: parseado.error.errors
    })
  }

  try {
    const { nombre, email } = parseado.data
    const id = await crearCliente(parseado.data)

    await enviarEmail({
      to: email,
      subject: "¡Bienvenido al gimnasio 💪!",
      html: `<h2>Hola ${nombre} 👋</h2><p>Gracias por registrarte. ¡Te esperamos para entrenar!</p>`
    })

    res.status(201).json({ id })
  } catch (error) {
    console.error("❌ Error al crear cliente:", error)
    res.status(500).json({ error: "Error al crear cliente" })
  }
}




// ✏️ Actualizar cliente
export async function modificarCliente(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarCliente(id, cambios);
    if (actualizado === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
}

// ❌ Eliminar cliente
export async function borrarCliente(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarCliente(id);
    if (eliminado === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
}

// 📊 Clientes activos
export async function verClientesActivos(req, res) {
  try {
    const activos = await getClientesActivos();
    res.json({ activos });
  } catch (error) {
    console.error("❌ Error al obtener clientes activos:", error);
    res.status(500).json({ error: "Error al obtener métrica de clientes activos" });
  }
}

// 📊 Nuevos clientes por mes
export async function verNuevosClientesPorMes(req, res) {
  try {
    const nuevos = await getNuevosClientesPorMes();
    res.json(nuevos);
  } catch (error) {
    console.error("❌ Error al obtener nuevos clientes:", error);
    res.status(500).json({ error: "Error al obtener métrica de nuevos clientes" });
  }
}

// 📊 Frecuencia de compra por cliente
export async function verFrecuenciaPorCliente(req, res) {
  try {
    const { id } = req.params;
    const frecuencia = await getFrecuenciaPorCliente(id);
    res.json({ cliente_id: id, compras: frecuencia });
  } catch (error) {
    console.error("❌ Error al obtener frecuencia:", error);
    res.status(500).json({ error: "Error al obtener métrica de frecuencia" });
  }
}
