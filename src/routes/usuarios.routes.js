import { Router } from "express";
import {
  listarUsuarios,
  verUsuario,
  crearNuevoUsuario,
  modificarUsuario,
  borrarUsuario,
  loginUsuario,
  registrarUsuario,
  verPerfil,
} from "../controllers/usuarios.controller.js";
import { verificarToken, verificarRol } from "../middlewares/auth.js";

const router = Router();

// 👥 CRUD básico
router.get("/", listarUsuarios);
router.get("/:id", verUsuario);
router.post("/", verificarToken, verificarRol("admin"), crearNuevoUsuario);
router.put("/:id", verificarToken, verificarRol("admin"), modificarUsuario);
router.delete("/:id", verificarToken, verificarRol("admin"), borrarUsuario);

// 🔐 Auth
router.post("/login", loginUsuario);
router.post("/registro", registrarUsuario);
router.get("/perfil", verificarToken, verPerfil);



export default router;