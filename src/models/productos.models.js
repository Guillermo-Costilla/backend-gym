import { db } from "../db/libsql.js";

// 📦 Obtener todos los productos
export async function getAllProductos() {
  const result = await db.execute(`
    SELECT * FROM productos
    ORDER BY nombre ASC
  `);
  return result.rows;
}

// 🔍 Obtener producto por ID
export async function getProductoPorId(id) {
  const result = await db.execute(`
    SELECT * FROM productos
    WHERE id = ? LIMIT 1
  `, [id]);
  return result.rows[0] || null;
}

// ➕ Crear nuevo producto
export async function crearProducto({ nombre, precio, stock, categoria }) {
  const result = await db.execute(`
    INSERT INTO productos (nombre, precio, stock, categoria)
    VALUES (?, ?, ?, ?)
  `, [nombre, precio, stock, categoria]);
  return result.lastInsertRowid;
}

// ✏️ Actualizar producto
export async function actualizarProducto(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE productos SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar producto
export async function eliminarProducto(id) {
  const result = await db.execute("DELETE FROM productos WHERE id = ?", [id]);
  return result.rowsAffected;
}

// 📊 Métrica: productos activos
export async function getProductosActivos() {
  const result = await db.execute(`
    SELECT COUNT(*) AS activos
    FROM productos
    WHERE activo = 1
  `);
  return result.rows[0]?.activos || 0;
}

// 📊 Métrica: stock total
export async function getStockTotal() {
  const result = await db.execute(`
    SELECT SUM(stock) AS total_stock
    FROM productos
    WHERE activo = 1
  `);
  return result.rows[0]?.total_stock || 0;
}