import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(2),
  email: z.email(),
  telefono: z.string().optional(),
  activo: z.boolean().optional(),
});