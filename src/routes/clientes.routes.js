import { Router } from "express";
import {
  listarClientes,
  verCliente,
  crearNuevoCliente,
  modificarCliente,
  borrarCliente,
  verClientesActivos,
  verNuevosClientesPorMes,
  verFrecuenciaPorCliente,

} from "../controllers/clientes.controller.js";
import { verificarToken, verificarRol } from "../middlewares/auth.js";

const router = Router();

// 🧍 Listar todos los clientes
router.get("/", verificarToken, listarClientes);

// 🔍 Ver cliente por ID
router.get("/:id", verificarToken, verCliente);

// ➕ Crear nuevo cliente
router.post("/", verificarToken, verificarRol("admin"), crearNuevoCliente);

// ✏️ Actualizar cliente
router.put("/:id", verificarToken, verificarRol("admin"), modificarCliente);

// ❌ Eliminar cliente
router.delete("/:id", verificarToken, verificarRol("admin"), borrarCliente);

// 📊 Métricas
router.get("/metricas/activos", verificarToken, verClientesActivos);
router.get("/metricas/nuevos", verificarToken, verNuevosClientesPorMes);
router.get("/metricas/frecuencia/:id", verificarToken, verFrecuenciaPorCliente);


export default router;