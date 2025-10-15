import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z.string().min(2),
  email: z.email(),
  password: z.string().min(4),
  rol: z.enum(["admin", "staff"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
