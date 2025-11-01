import { z } from "zod"

export const pagosSchema = z.object({
  cliente_id: z.number(),
  monto: z.number().min(1),
  metodo: z.string().min(1),
  tipo: z.string(),
  fecha_pago: z.string(),
  pagado: z.number(),
})
