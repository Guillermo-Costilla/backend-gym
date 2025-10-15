import { Router } from "express";
import {
  listarVentas,
  verVenta,
  crearNuevaVenta,
  modificarVenta,
  borrarVenta,
  verVentasPorDia,
  verProductoMasVendido,
} from "../controllers/ventas.controller.js";
import { verificarToken, verificarRol } from "../middlewares/auth.js";

const router = Router();

// 🧾 CRUD básico
router.get("/", listarVentas);
router.get("/:id", verVenta);
router.post("/", verificarToken, verificarRol("admin"), crearNuevaVenta);
router.put("/:id", verificarToken, verificarRol("admin"), modificarVenta);
router.delete("/:id", verificarToken, verificarRol("admin"), borrarVenta);

// 📊 Métricas
router.get("/metricas/por-dia", verVentasPorDia);
router.get("/metricas/mas-vendido", verProductoMasVendido);

export default router;