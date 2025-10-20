# CRM Gym — Backend EN DESARROLO 🛠️🔧⚙️

Sistema CRM modular para gestión de clientes, asistencias, pagos, productos, ventas y métricas en gimnasios. Este backend está construido con Node.js, Express y LibSQL (Turso), priorizando escalabilidad, automatización y validaciones robustas.

## 🚧 Estado
En desarrollo activo — arquitectura modular y validaciones Zod implementadas.

## 🧰 Stack
- Node.js + Express
- LibSQL (Turso)
- Zod para validaciones
- Nodemailer para notificaciones
- Cron para tareas automáticas
- Dotenv + CORS configurado

## 📦 Módulos implementados
- Clientes: CRUD con validación, sanitización y email de bienvenida
- Pagos: registro, notificación automática y cron diario
- Productos: gestión con stock y precios
- Asistencias: registro por QR y DNI
- Ventas: en desarrollo
- Usuarios: autenticación y roles
- Dashboard: métricas y KPIs

## 📬 Notificaciones
- Email automático al registrar cliente
- Cron diario para pagos vencidos y cumpleaños

## 🧪 Validaciones
- Zod en todos los endpoints
- Sanitización previa al insert/update
- Manejo de errores con logs y respuestas claras

## 🚀 Scripts
-- bash --
npm install
npm run dev

🔐 Variables de entorno
PORT=3000
FRONT_URL=http://localhost:5173
DATABASE_URL=file:./dev.db
EMAIL_AUTH_USER=tuemail@gmail.com
EMAIL_AUTH_PASS=tucontraseñaApp
SMTP_HOST=smtp.gmail.com


📁 Estructura
src/
├── controllers/
├── models/
├── routes/
├── schemas/
├── middlewares/
├── jobs/
└── utils/


🧠 Autor
Desarrollado por Guille Costilla — Full Stack MERN + Turso
