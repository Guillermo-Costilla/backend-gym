# 🏋️ CRM Gym — Backend

API REST para la gestión integral de gimnasios: clientes, asistencias, pagos, ventas y métricas.

Diseñada con arquitectura modular, validaciones robustas y automatización de procesos clave del negocio.

---

## 🚀 Demo

🔗 https://crm-gym-pi.vercel.app

---

## ⚙️ Funcionalidades principales

- 🔐 Autenticación con JWT y control de roles (admin / staff)
- 👥 Gestión de clientes (CRUD + métricas)
- 💳 Gestión de pagos (pendientes, vencidos, próximos)
- 📅 Registro de asistencias (público mediante QR + DNI)
- 🛒 Ventas y productos
- 📊 Dashboard con KPIs
- 📤 Exportación de datos a Excel

---

## 🤖 Automatizaciones

- 📧 Emails automáticos:
  - Alta de cliente
  - Confirmación de pagos/ventas
  - Recordatorios de pagos vencidos
  - Saludos de cumpleaños

- ⏰ Cron diario:
  - Notificación de pagos vencidos
  - Notificación de cumpleaños

---

## 🛠 Stack

- Node.js + Express  
- LibSQL (Turso)  
- Zod (validaciones)  
- Nodemailer  
- node-cron  

---

## 🧱 Arquitectura

```text
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middlewares/
 ├── jobs/
 └── utils/
```
 

Arquitectura modular basada en separación de responsabilidades.

## 🔐 Seguridad

Validaciones en todos los endpoints (Zod)
Middleware de autenticación
Control de roles
Manejo centralizado de errores

## 📦 Endpoints destacados

- POST /usuarios/login
- GET /clientes
- GET /pagos/vencidos
- POST /asistencias/registro
- GET /dashboard

##📄 Colección completa incluida: rutas.yaak.json

⚡ Instalación
- pnpm install
- pnpm start

Configurar .env:
```text
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=tu_secret
```

## 🧠 Qué demuestra este proyecto

- Diseño de API REST escalable
- Automatización de procesos de negocio
- Manejo de tareas programadas
- Integración de servicios externos (email)
- Buenas prácticas en validación y seguridad

##👨‍💻 Autor

Guillermo Costilla — Full Stack Developer
