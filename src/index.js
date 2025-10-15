import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientesRoutes from "./routes/clientes.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import asistenciasRoutes from "./routes/asistencias.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cron from "node-cron";
import { notificarPagosVencidos, notificarCumpleaños } from "./jobs/notificaciones.js";


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Ejecutando cron diario...");
  await notificarPagosVencidos();
  await notificarCumpleaños();
});


app.use("/clientes", clientesRoutes);
app.use("/pagos", pagosRoutes);
app.use("/productos", productosRoutes);
app.use("/asistencias", asistenciasRoutes);
app.use("/ventas", ventasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/dashboard", dashboardRoutes);


app.listen(PORT, () => {
  console.log("Servidor CRM Gym corriendo en puerto 3000");
});