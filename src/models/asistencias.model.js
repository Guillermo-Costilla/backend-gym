import { db } from "../db/libsql.js";

// 🕒 Obtener todas las asistencias
export async function getAllAsistencias() {
  const result = await db.execute(`
    SELECT a.*, c.nombre AS cliente
    FROM asistencias a
    JOIN clientes c ON c.id = a.cliente_id
    ORDER BY a.hora_ingreso DESC
  `);
  return result.rows;
}

// 🔍 Obtener asistencia por ID
export async function getAsistenciaPorId(id) {
  const result = await db.execute(`
    SELECT a.*, c.nombre AS cliente
    FROM asistencias a
    JOIN clientes c ON c.id = a.cliente_id
    WHERE a.id = ? LIMIT 1
  `, [id]);
  return result.rows[0] || null;
}

export async function registrarAsistencia(cliente_id) {
  const result = await db.execute(`
    INSERT INTO asistencias (cliente_id)
    VALUES (?)
  `, [cliente_id]);
  return result.lastInsertRowid;
}

export async function getAsistenciasPorDia(fecha) {
  const result = await db.execute(`
    SELECT clientes.nombre, COUNT(*) AS asistencias
    FROM asistencias
    JOIN clientes ON clientes.id = asistencias.cliente_id
    WHERE DATE(hora_ingreso) = ?
    GROUP BY cliente_id
  `, [fecha])
  return result.rows
}


// ➕ Crear asistencia
export async function crearAsistencia({ cliente_id, hora_ingreso, hora_salida }) {
  const result = await db.execute(`
    INSERT INTO asistencias (cliente_id, hora_ingreso, hora_salida)
    VALUES (?, ?, ?)
  `, [cliente_id, hora_ingreso, hora_salida]);
  return result.lastInsertRowid;
}

// ✏️ Actualizar asistencia
export async function actualizarAsistencia(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE asistencias SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar asistencia
export async function eliminarAsistencia(id) {
  const result = await db.execute("DELETE FROM asistencias WHERE id = ?", [id]);
  return result.rowsAffected;
}

// 📊 Concurrencia actual
export async function getConcurrenciaActual() {
  const result = await db.execute(`
    SELECT COUNT(*) AS en_gimnasio
    FROM asistencias
    WHERE hora_ingreso <= CURRENT_TIMESTAMP AND hora_salida > CURRENT_TIMESTAMP
  `);
  return result.rows[0]?.en_gimnasio || 0;
}