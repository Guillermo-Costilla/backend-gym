import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  getAllUsuarios,
  getUsuarioPorId,
  getUsuarioPorEmail,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../models/usuarios.models.js";
import { usuarioSchema, loginSchema } from "../schemas/usuarios.schema.js";


dotenv.config();

// 👥 Listar todos los usuarios
export async function listarUsuarios(req, res) {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// 🔍 Ver usuario por ID
export async function verUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await getUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

// 👤 Obtener perfil del usuario logueado
export async function verPerfil(req, res) {
  try {
    const { id } = req.usuario; // viene del token decodificado
    const usuario = await getUsuarioPorId(id);

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    });
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
}


// 🔐 Login por email
export async function loginUsuario(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos inválidos", detalles: parsed.error.errors });
    }

    const { email, password } = parsed.data;
    const usuario = await getUsuarioPorEmail(email);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error al autenticar usuario" });
  }
}


// 🔐 Registro de usuario
export async function registrarUsuario(req, res) {
  try {
    const parsed = usuarioSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos inválidos", detalles: parsed.error.errors });
    }

    const { nombre, email, password, rol } = parsed.data;

    const existente = await getUsuarioPorEmail(email);
    if (existente) return res.status(409).json({ error: "El email ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);
    const id = await crearUsuario({ nombre, email, password_hash, rol });

    const token = jwt.sign({ id: id.toString(), rol }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(201).json({
      mensaje: "Registro exitoso",
      token,
      usuario: { id, nombre, email, rol },
    });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}


// ➕ Crear nuevo usuario
export async function crearNuevoUsuario(req, res) {
  try {
    const { nombre, email, password_hash, rol, activo } = req.body;

    if (!nombre || !email || !password_hash) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const id = await crearUsuario({ nombre, email, password_hash, rol, activo });
    res.status(201).json({ id });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// ✏️ Actualizar usuario
export async function modificarUsuario(req, res) {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const actualizado = await actualizarUsuario(id, cambios);
    if (actualizado === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ actualizado });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

// ❌ Eliminar usuario
export async function borrarUsuario(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarUsuario(id);
    if (eliminado === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ eliminado });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}