import { db } from "../db/libsql.js";

// 🧾 Obtener todas las ventas
export async function getAllVentas() {
  const result = await db.execute(`
    SELECT v.*, c.nombre AS cliente, p.nombre AS producto
    FROM ventas v
    JOIN clientes c ON c.id = v.cliente_id
    JOIN productos p ON p.id = v.producto_id
    ORDER BY v.fecha_venta DESC
  `);
  return result.rows;
}

// 🔍 Obtener venta por ID
export async function getVentaPorId(id) {
  const result = await db.execute(`
    SELECT v.*, c.nombre AS cliente, p.nombre AS producto
    FROM ventas v
    JOIN clientes c ON c.id = v.cliente_id
    JOIN productos p ON p.id = v.producto_id
    WHERE v.id = ? LIMIT 1
  `, [id]);
  return result.rows[0] || null;
}

// ➕ Crear nueva venta
export async function crearVenta({ cliente_id, producto_id, cantidad, fecha_venta, total }) {
  const result = await db.execute(`
    INSERT INTO ventas (cliente_id, producto_id, cantidad, fecha_venta, total)
    VALUES (?, ?, ?, ?, ?)
  `, [cliente_id, producto_id, cantidad, fecha_venta, total]);
  return result.lastInsertRowid;
}

// ✏️ Actualizar venta
export async function actualizarVenta(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE ventas SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar venta
export async function eliminarVenta(id) {
  const result = await db.execute("DELETE FROM ventas WHERE id = ?", [id]);
  return result.rowsAffected;
}

// 📊 Métrica: ventas por día
export async function getVentasPorDia() {
  const result = await db.execute(`
    SELECT date(fecha_venta) AS dia, SUM(total) AS ingresos
    FROM ventas
    GROUP BY dia
    ORDER BY dia DESC
  `);
  return result.rows;
}

// 📊 Métrica: producto más vendido
export async function getProductoMasVendido() {
  const result = await db.execute(`
    SELECT p.nombre, SUM(v.cantidad) AS total_vendido
    FROM ventas v
    JOIN productos p ON p.id = v.producto_id
    GROUP BY p.id
    ORDER BY total_vendido DESC
    LIMIT 1
  `);
  return result.rows[0] || null;
}

export async function getVentasDelDia(fecha) {
  const result = await db.execute(`
    SELECT COUNT(*) AS total
    FROM ventas
    WHERE DATE(fecha) = ?
  `, [fecha]);
  return result.rows[0]?.total || 0;
}

export async function getIngresosDelDia(fecha) {
  const result = await db.execute(`
    SELECT SUM(p.precio * v.cantidad) AS ingresos
    FROM ventas v
    JOIN productos p ON p.id = v.producto_id
    WHERE DATE(v.fecha_venta) = ?
  `, [fecha]);
  return result.rows[0]?.ingresos || 0;
}

export async function getVentasPorMes(mes) {
  const result = await db.execute(`
    SELECT ventas.id, ventas.cantidad, ventas.fecha_venta,
           productos.nombre AS producto,
           clientes.nombre AS cliente
    FROM ventas
    JOIN productos ON productos.id = ventas.producto_id
    JOIN clientes ON clientes.id = ventas.cliente_id
    WHERE strftime('%Y-%m', ventas.fecha_venta) = ?
  `, [mes]);
  return result.rows;
}
