import { z } from "zod"

export const clienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional(),
  activo: z.boolean().optional(),

  fecha_nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Formato de fecha inválido (esperado yyyy-mm-dd)"
    }),

  dni: z
    .union([
      z.string().regex(/^\d+$/, "DNI debe ser numérico"),
      z.number().int().positive()
    ])
    .transform((val) => typeof val === "string" ? parseInt(val, 10) : val)
})