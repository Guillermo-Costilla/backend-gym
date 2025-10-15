import { notificarPagosVencidos, notificarCumpleaños } from "./notificaciones.js";

async function ejecutarCronDiario() {
  console.log("🚀 Ejecutando cron diario de notificaciones...");

  await notificarPagosVencidos();
  await notificarCumpleaños();

  console.log("✅ Cron diario finalizado");
}

ejecutarCronDiario();
