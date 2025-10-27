import { Router } from "express";
import {
  listarPagos,
  verPago,
  crearNuevoPago,
  modificarPago,
  borrarPago,
  listarPagosVencidos,
  listarPagosProximos,
  verIngresosMensuales,
} from "../controllers/pagos.controller.js";
import { verificarToken, verificarRol } from "../middlewares/auth.js";

const router = Router();

// 💳 CRUD básico
router.get("/", listarPagos);

// 🔴 Pagos vencidos
router.get("/vencidos", listarPagosVencidos);

// 🟡 Pagos próximos (query param: ?dias=7)
router.get("/proximos", listarPagosProximos);

// 📊 Métrica mensual
router.get("/ingresos/mensuales", verIngresosMensuales);

// 🔍 Ver pago por ID (debe ir al final)
router.get("/:id", verPago);

// ✏️ Modificar pago
router.put("/:id", verificarToken, verificarRol("admin"), modificarPago);

// 🗑️ Borrar pago
router.delete("/:id", verificarToken, verificarRol("admin"), borrarPago);

// ➕ Crear nuevo pago
router.post("/", verificarToken, verificarRol("admin"), crearNuevoPago);


export default router;