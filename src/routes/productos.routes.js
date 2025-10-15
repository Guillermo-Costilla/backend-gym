import { Router } from "express";
import {
  listarProductos,
  verProducto,
  crearNuevoProducto,
  modificarProducto,
  borrarProducto,
  verProductosActivos,
  verStockTotal,
} from "../controllers/productos.controller.js";

const router = Router();

// 📦 CRUD básico
router.get("/", listarProductos);
router.get("/:id", verProducto);
router.post("/", crearNuevoProducto);
router.put("/:id", modificarProducto);
router.delete("/:id", borrarProducto);

// 📊 Métricas
router.get("/metricas/activos", verProductosActivos);
router.get("/metricas/stock", verStockTotal);

export default router;