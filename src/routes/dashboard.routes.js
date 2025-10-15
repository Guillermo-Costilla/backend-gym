import { Router } from "express";
import { verDashboard } from "../controllers/dashboard.controller.js";
import { verificarToken, verificarRol } from "../middlewares/auth.js";

const router = Router();

router.get("/", verificarToken, verificarRol("admin"), verDashboard);

export default router;