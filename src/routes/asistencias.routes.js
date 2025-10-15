import { Router } from "express";
import {
  listarAsistencias,
  verAsistencia,
  crearNuevaAsistencia,
  modificarAsistencia,
  borrarAsistencia,
  verConcurrenciaActual,
  registrarAsistenciaPorDNI,
  verAsistenciasPorDia,
} from "../controllers/asistencias.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

// 🕒 CRUD básico
router.get("/", listarAsistencias);
router.get("/:id", verAsistencia);
router.post("/", crearNuevaAsistencia);
router.put("/:id", modificarAsistencia);
router.delete("/:id", borrarAsistencia);

// 📊 Concurrencia actual
router.get("/concurrencia", verConcurrenciaActual);

// 🟢 Ruta pública para escaneo QR + DNI
router.post("/registro", registrarAsistenciaPorDNI);

// 🔐 Métricas por día (requiere token)
router.get("/por-dia", verificarToken, verAsistenciasPorDia);


export default router;