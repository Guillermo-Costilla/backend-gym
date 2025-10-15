import { getPagosVencidos, getClientesCumpleanieros } from "../models/clientes.model.js";
import { enviarEmail } from "../utils/mailer.js";

export async function notificarPagosVencidos() {
  const vencidos = await getPagosVencidos();

  for (const pago of vencidos) {
    await enviarEmail({
      to: pago.email,
      subject: "Pago vencido",
      html: `
        <h2>Hola ${pago.nombre} 👋</h2>
        <p>Tu pago de <strong>$${pago.monto}</strong> (${pago.tipo}) venció el <strong>${pago.fecha_vencimiento}</strong>.</p>
        <p>Por favor regularizá tu situación para seguir entrenando sin interrupciones 💪</p>
      `,
    });
  }
}


export async function notificarCumpleaños() {
  const cumpleanieros = await getClientesCumpleanieros();
  for (const cliente of cumpleanieros) {
    await enviarEmail({
      to: cliente.email,
      subject: "¡Feliz cumpleaños!",
      html: `<h2>🎉 ¡Feliz cumple ${cliente.nombre}!</h2><p>Te regalamos una clase extra. ¡Pasala genial!</p>`,
    });
  }
}