import { db } from "../db/libsql.js";

// 🧍 Obtener todos los clientes
export async function getAllClientes() {
  const result = await db.execute("SELECT * FROM clientes ORDER BY id DESC");
  return result.rows;
}

// 🔍 Obtener cliente por ID
export async function getClientePorId(id) {
  const result = await db.execute("SELECT * FROM clientes WHERE id = ? LIMIT 1", [id]);
  return result.rows[0] || null;
}

export async function getClientePorDNI(dni) {
  const result = await db.execute(`
    SELECT id, nombre FROM clientes
    WHERE dni = ? LIMIT 1
  `, [dni]);
  return result.rows[0] || null;
}


// ➕ Crear nuevo cliente
export async function crearCliente({ nombre, email, telefono, fecha_nacimiento, foto_url }) {
  const result = await db.execute(
    `INSERT INTO clientes (nombre, email, telefono, fecha_nacimiento, foto_url)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, email, telefono, fecha_nacimiento, foto_url]
  );
  return result.lastInsertRowid;
}

// ✏️ Actualizar cliente
export async function actualizarCliente(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE clientes SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar cliente
export async function eliminarCliente(id) {
  const result = await db.execute("DELETE FROM clientes WHERE id = ?", [id]);
  return result.rowsAffected;
}


// 📊 Clientes activos
export async function getClientesActivos() {
  const result = await db.execute(`
    SELECT COUNT(*) AS activos
    FROM clientes
    WHERE activo = 1
  `);
  return result.rows[0]?.activos || 0;
}

// 📊 Nuevos clientes por mes
export async function getNuevosClientesPorMes() {
  const result = await db.execute(`
    SELECT strftime('%Y-%m', fecha_alta) AS mes, COUNT(*) AS nuevos
    FROM clientes
    GROUP BY mes
    ORDER BY mes DESC
  `);
  return result.rows;
}

// 📊 Frecuencia de compra por cliente
export async function getFrecuenciaPorCliente(id) {
  const result = await db.execute(`
    SELECT COUNT(*) AS compras
    FROM ventas
    WHERE cliente_id = ?
  `, [id]);
  return result.rows[0]?.compras || 0;
}

export async function getClientesCumpleanieros() {
  const result = await db.execute(`
    SELECT id, nombre, email
    FROM clientes
    WHERE strftime('%m-%d', fecha_nacimiento) = strftime('%m-%d', 'now')
  `);
  return result.rows;
}
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
