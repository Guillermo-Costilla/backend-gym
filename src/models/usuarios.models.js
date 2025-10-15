import { db } from "../db/libsql.js";

// 👥 Obtener todos los usuarios
export async function getAllUsuarios() {
  const result = await db.execute(`
    SELECT id, nombre, email, rol, activo
    FROM usuarios
    ORDER BY nombre ASC
  `);
  return result.rows;
}

// 🔍 Obtener usuario por ID
export async function getUsuarioPorId(id) {
  const result = await db.execute(`
    SELECT id, nombre, email, rol, activo
    FROM usuarios
    WHERE id = ? LIMIT 1
  `, [id]);
  return result.rows[0] || null;
}

// 🔐 Obtener usuario por email (para login)
export async function getUsuarioPorEmail(email) {
  const result = await db.execute(`
    SELECT *
    FROM usuarios
    WHERE email = ? LIMIT 1
  `, [email]);
  return result.rows[0] || null;
}

// ➕ Crear nuevo usuario
export async function crearUsuario({ nombre, email, password_hash, rol = "staff", activo = 1 }) {
  const result = await db.execute(`
    INSERT INTO usuarios (nombre, email, password_hash, rol, activo)
    VALUES (?, ?, ?, ?, ?)
  `, [nombre, email, password_hash, rol, activo]);
  return result.lastInsertRowid;
}

// ✏️ Actualizar usuario
export async function actualizarUsuario(id, data) {
  const campos = [];
  const valores = [];

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = ?`);
    valores.push(value);
  }

  valores.push(id);

  const result = await db.execute(
    `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`,
    valores
  );

  return result.rowsAffected;
}

// ❌ Eliminar usuario
export async function eliminarUsuario(id) {
  const result = await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
  return result.rowsAffected;
}