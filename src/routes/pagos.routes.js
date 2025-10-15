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
router.get("/:id", verPago);
router.post("/", verificarToken, verificarRol("admin"), crearNuevoPago);
router.put("/:id", verificarToken, verificarRol("admin"), modificarPago);
router.delete("/:id", verificarToken, verificarRol("admin"), borrarPago);

// 🔴 Pagos vencidos
router.get("/vencidos", listarPagosVencidos);

// 🟡 Pagos próximos (query param: ?dias=7)
router.get("/proximos", listarPagosProximos);

// 📊 Métrica mensual
router.get("/ingresos/mensuales", verIngresosMensuales);

export default router;