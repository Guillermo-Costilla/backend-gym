import { Router } from "express";
import { exportarPagosPorMes, exportarVentasPorMes } from "../controllers/exportaciones.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.js";

const router = Router();

router.get("/pagos", verificarToken, verificarRol("admin"), exportarPagosPorMes);
router.get("/ventas", verificarToken, verificarRol("admin"), exportarVentasPorMes);

export default router;
