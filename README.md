# CRM Gym — Backend (EN DESARROLLO) 🛠️

API REST modular para gestionar clientes, asistencias, pagos, productos, ventas y métricas en gimnasios. Construida con Node.js, Express y LibSQL (Turso). Incluye autenticación por JWT, validaciones Zod, notificaciones por email y exportación a Excel.

## Estado
En desarrollo activo. Arquitectura modular y validaciones Zod aplicadas.

## Stack
- Node.js + Express
- LibSQL (Turso)
- Zod
- Nodemailer
- node-cron
- dotenv, cors

## Módulos principales
- Clientes: CRUD, validaciones y email de bienvenida
- Pagos: registro, listados, notificaciones y cron diario
- Productos: CRUD de productos
- Asistencias: registro público (desde QR por DNI) y consultas
- Ventas: registro y listados
- Usuarios: registro/login y control de roles (admin/staff)
- Dashboard: métricas y KPIs

## Notificaciones y tareas programadas
- Emails en eventos: alta de cliente, confirmación de venta/pago, recordatorios de pagos vencidos, saludos de cumpleaños.
- Cron diario (configurado en `src/index.js`) ejecuta `notificarPagosVencidos()` y `notificarCumpleaños()` a las 09:00.

## Requisitos
- Node.js 18+
- pnpm o npm
- Acceso a la base de datos (Turso/SQLite)

## Inicio rápido

1) Instalar dependencias:

```powershell
pnpm install
```

2) Crear `.env` con variables (ejemplo abajo) y levantar servidor:

```powershell
pnpm start
```

3) Para ejecutar el cron manualmente (pruebas):

```powershell
node src/jobs/cron-diario.js
```

## Variables de entorno (ejemplo)

```text
PORT=3000
FRONT_URL=http://localhost:5173
DATABASE_URL=file:./dev.db
JWT_SECRET=tu_jwt_secret
EMAIL_HOST=smtp.tu-proveedor.com
EMAIL_PORT=587
EMAIL_USER=usuario@tudominio
EMAIL_PASS=contraseña
```

## Estructura relevante

- `src/index.js` — punto de entrada y cron
- `src/routes/*.js` — definiciones de rutas
- `src/controllers/*.controller.js` — lógica de cada recurso
- `src/models/*.js` — consultas a la DB
- `src/jobs/*.js` — tareas y notificaciones
- `src/utils/mailer.js` — wrapper Nodemailer

## Documentación de endpoints (colección `rutas.yaak.json`)

Incluimos una colección exportada (`rutas.yaak.json`) con peticiones organizadas por carpetas: `Autenticación`, `Clientes`, `Asistencias`, `Pagos`, `Métricas`, `Exportaciones` y `CRM Gym`.

Nota: la colección contiene ejemplos usados durante pruebas (incluye tokens de ejemplo). No compartas tokens reales en repositorios públicos; sustituye por `<JWT>`.

Listado resumido de endpoints (extraído de la colección y del código):

Link Backend: `https://crm-gym-pi.vercel.app`

- Autenticación
  - POST `/usuarios/registro` — Crear usuario (rol: admin|staff)
  - POST `/usuarios/login` — Login, devuelve JWT

- Clientes
  - GET `/clientes` — Listar clientes (auth)
  - GET `/clientes/:id` — Obtener cliente (auth)
  - POST `/clientes` — Crear cliente (auth + admin)
  - PUT `/clientes/:id` — Actualizar (auth + admin)
  - DELETE `/clientes/:id` — Eliminar (auth + admin)
  - GET `/clientes/metricas/activos` — Clientes activos (auth)
  - GET `/clientes/metricas/nuevos` — Nuevos por mes (auth)

- Asistencias
  - POST `/asistencias/registro` — Registro público por DNI (no auth)
  - GET `/asistencias/por-dia?fecha=YYYY-MM-DD` — (auth)
  - GET `/asistencias/por-cliente/:id` — (auth)
  - GET `/asistencias/por-rango?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` — (auth)

- Pagos
  - GET `/pagos` — Listar (auth)
  - GET `/pagos/:id` — Obtener pago (auth)
  - GET `/pagos/pendientes` — Pendientes (auth)
  - GET `/pagos/vencidos` — Vencidos (auth)
  - GET `/pagos/proximos?dias=7` — Próximos (auth)
  - POST `/pagos` — Crear pago (auth)
  - PUT `/pagos/:id` — Actualizar pago (auth)
  - DELETE `/pagos/:id` — Eliminar (auth)

- Ventas
  - GET `/ventas` — Listar ventas (auth)
  - GET `/ventas/:id` — Obtener venta (auth)
  - GET `/ventas/por-cliente/:id` — Historial (auth)
  - GET `/ventas/por-dia?fecha=YYYY-MM-DD` — (auth)
  - GET `/ventas/ingresos?fecha=YYYY-MM-DD` — (auth)
  - POST `/ventas` — Registrar venta (auth)

- Dashboard
  - GET `/dashboard?fecha=YYYY-MM-DD` — Métricas del día (auth + admin)

- Exportaciones
  - GET `/exportaciones/pagos?mes=YYYY-MM` — Exportar pagos a Excel (auth + admin)
  - GET `/exportaciones/ventas?mes=YYYY-MM` — Exportar ventas a Excel (auth + admin)

### Ejemplos curl

1) Login (obtener JWT):

```bash
curl -X POST "https://crm-gym-pi.vercel.app/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"guille.test@example.com","password":"12345678"}'
```

Respuesta esperada (ejemplo):

```json
{ "token": "<JWT>", "usuario": { "id": 1, "email": "guille.test@example.com", "rol": "admin" } }
```

2) Crear cliente (admin):

```bash
curl -X POST "https://crm-gym-pi.vercel.app/clientes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"nombre":"Juan Pérez","dni":"12345678","email":"juan@example.com","telefono":"3811234567","fecha_nacimiento":"1990-05-15"}'
```

3) Registrar asistencia (pública, desde QR):

```bash
curl -X POST "https://crm-gym-pi.vercel.app/asistencias/registro" \
  -H "Content-Type: application/json" \
  -d '{"dni":"39921167"}'
```

4) Crear pago (admin):

```bash
curl -X POST "https://crm-gym-pi.vercel.app/pagos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"cliente_id":20,"monto":5000,"tipo":"Mensual","fecha_pago":"2025-10-28","pagado":1,"metodo":"efectivo"}'
```

5) Obtener pagos vencidos (admin/staff):

```bash
curl -X GET "https://crm-gym-pi.vercel.app/pagos/vencidos" \
  -H "Authorization: Bearer <JWT>"
```

6) Exportar ventas de un mes (admin):

```bash
curl -X GET "https://crm-gym-pi.vercel.app/exportaciones/ventas?mes=2025-10" \
  -H "Authorization: Bearer <JWT>"
```

## Importar la colección `rutas.yaak.json`

La colección `rutas.yaak.json` (incluida en el repo) puede importarse en Yaak, Insomnia o Postman. En Yaak selecciona "Importar" → "Archivo" y elige `rutas.yaak.json`. Reemplaza tokens de prueba por tu JWT en el entorno.

## Buenas prácticas y seguridad
- Nunca comites credenciales ni tokens reales. Usa archivos `.env` ignorados por Git.
- Revoca y regenera JWT si se filtran.

## Contribuir
1. Crea una rama: `git checkout -b feat/mi-cambio`
2. Añade tests y actualiza documentación
3. Abre PR con descripción clara

---
Última actualización: 2025-10-27
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
