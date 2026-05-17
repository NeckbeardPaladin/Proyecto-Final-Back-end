# API REST - Gestión de Tareas (Proyecto Final)

API de lista de tareas con registro, login JWT y CRUD protegido. Base de datos: **SQL Server** (SSMS).

## Requisitos

- Node.js 18+
- SQL Server Express + SSMS
- Postman o Insomnia (pruebas)

## Instalación

```bash
cd proyecto-final-api
npm install
```

Copia variables de entorno:

```bash
copy .env.example server.env
```

Edita `server.env` (contraseña SQL o Windows auth).

## Base de datos

1. En SSMS, conéctate a `.\SQLEXPRESS` (o tu instancia).
2. Ejecuta el script `database/schema.sql`.
3. Si la API no conecta, sigue **`database/SETUP-CONEXION.md`** (habilitar TCP en el puerto 1433).

## Ejecutar

```bash
npm run dev
```

- `GET http://localhost:3000/` — API en línea
- `GET http://localhost:3000/health/db` — prueba de base de datos

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Estado de la API |
| GET | `/health/db` | No | Prueba conexión SQL |
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Login → token JWT |
| POST | `/api/tasks` | Bearer | Crear tarea |
| GET | `/api/tasks` | Bearer | Listar (filtros: `?status=`, `?due_date=`) |
| GET | `/api/tasks/:id` | Bearer | Una tarea |
| PUT | `/api/tasks/:id` | Bearer | Actualizar |
| DELETE | `/api/tasks/:id` | Bearer | Eliminar |

### Ejemplos

**Registro**

```http
POST /api/auth/register
Content-Type: application/json

{ "email": "user@test.com", "password": "123456" }
```

**Login**

```http
POST /api/auth/login

{ "email": "user@test.com", "password": "123456" }
```

Respuesta: `{ "success": true, "data": { "token": "..." } }`

**Crear tarea** (header `Authorization: Bearer <token>`)

```http
POST /api/tasks

{
  "title": "Mi tarea",
  "description": "Opcional",
  "status": "pending",
  "due_date": "2026-05-20"
}
```

`status`: `pending` | `in_progress` | `done`

## Postman

Importa `postman/Todo-API.postman_collection.json`. Orden sugerido:

1. Register → Login (guarda el token automáticamente)
2. Create Task → List → Get → Update → Delete

## Estructura del proyecto

```
src/
  config/db.js
  controllers/
  models/
  routes/
  middlewares/
server.js
database/schema.sql
```

## Entregables del curso

- [x] Código fuente
- [ ] Capturas (servidor, SSMS, Postman por paso)
- [x] Documentación (este README)
- [x] Colección Postman
