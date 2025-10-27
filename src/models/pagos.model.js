import { db } from "../db/libsql.js";

// 💳 Obtener todos los pagos con nombre de cliente
export async function getAllPagos() {
  const result = await db.execute(`
    SELECT p.*, c.nombre AS cliente
    FROM pagos p
    JOIN clientes c ON c.id = p.cliente_id
    ORDER BY p.fecha_pago DESC
  `);
  return result.rows;
}

// 🔍 Obtener pago por ID
export async function getPagoPorId(id) {
  const result = await db.execute(`
    SELECT p.*, c.nombre AS cliente
    FROM pagos p
    JOIN clientes c ON c.id = p.cliente_id
    WHERE p.id = ? LIMIT 1
  `, [id]);
  return result.rows[0] || null;
}

// ➕ Crear nuevo pago
export async function crearPago({ cliente_id, monto, tipo, fecha_pago, pagado = 1, metodo }) {
  const result = await db.execute(`
    INSERT INTO pagos (cliente_id, monto, tipo, fecha_pago, pagado, metodo)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [cliente_id, monto, tipo, fecha_pago, pagado, metodo]);
  return result.lastInsertRowid;
}

// ✏️ Actualizar pago
export async function actualizarPago(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE pagos SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar pago
export async function eliminarPago(id) {
  const result = await db.execute("DELETE FROM pagos WHERE id = ?", [id]);
  return result.rowsAffected;
}

// 🔴 Obtener pagos vencidos
export async function getPagosVencidos() {
  const result = await db.execute(`
    SELECT pagos.id, pagos.monto, pagos.tipo, pagos.fecha_pago,
           DATE(pagos.fecha_pago, '+30 days') AS fecha_vencimiento,
           clientes.nombre, clientes.email
    FROM pagos
    JOIN clientes ON clientes.id = pagos.cliente_id
    WHERE pagos.pagado = 0
      AND DATE(pagos.fecha_pago, '+30 days') < DATE('now')
  `);
  return result.rows;
}


// 🟡 Obtener pagos próximos (X días)
export async function getPagosProximos(dias = 7) {
  const result = await db.execute(`
    SELECT p.*, c.nombre AS cliente
    FROM pagos p
    JOIN clientes c ON c.id = p.cliente_id
    WHERE p.fecha_pago BETWEEN date('now') AND date('now', '+${dias} days')
    AND p.pagado = 0
    ORDER BY p.fecha_pago ASC
  `);
  return result.rows;
}

// 📊 Métrica: ingresos mensuales
export async function getIngresosMensuales() {
  const result = await db.execute(`
    SELECT strftime('%Y-%m', fecha_pago) AS mes, SUM(monto) AS total
    FROM pagos
    WHERE pagado = 1
    GROUP BY mes
    ORDER BY mes DESC
  `);
  return result.rows;
}

export async function getPagosPorMes(mes) {
  const result = await db.execute(`
    SELECT pagos.id, pagos.monto, pagos.tipo, pagos.fecha_pago, pagos.pagado,
           clientes.nombre
    FROM pagos
    JOIN clientes ON clientes.id = pagos.cliente_id
    WHERE strftime('%Y-%m', pagos.fecha_pago) = ?
  `, [mes]);
  return result.rows;
}
