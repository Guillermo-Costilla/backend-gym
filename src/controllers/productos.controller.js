import {
  getAllProductos,
  getProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getProductosActivos,
  getStockTotal,
} from "../models/productos.models.js";

// 📦 Listar todos los productos
export async function listarProductos(req, res) {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (error) {
    console.error("❌ Error al listar productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

// 🔍 Ver producto por ID
export async function verProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await getProductoPorId(id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
}

// ➕ Crear nuevo producto
export async function crearNuevoProducto(req, res) {
  try {
    const { nombre, descripcion, precio, stock, activo } = req.body;

    if (!nombre || precio == null || stock == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const id = await crearProducto({ nombre, descripcion, precio, stock, activo });
    res.status(201).json({ id });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
}

// ✏️ Actualizar producto
export async function modificarProducto(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarProducto(id, cambios);
    if (actualizado === 0) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

// ❌ Eliminar producto
export async function borrarProducto(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarProducto(id);
    if (eliminado === 0) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}

// 📊 Productos activos
export async function verProductosActivos(req, res) {
  try {
    const activos = await getProductosActivos();
    res.json({ activos });
  } catch (error) {
    console.error("❌ Error al obtener productos activos:", error);
    res.status(500).json({ error: "Error al obtener métrica de productos activos" });
  }
}

// 📊 Stock total
export async function verStockTotal(req, res) {
  try {
    const total = await getStockTotal();
    res.json({ total_stock: total });
  } catch (error) {
    console.error("❌ Error al obtener stock total:", error);
    res.status(500).json({ error: "Error al obtener métrica de stock" });
  }
}