# Ventus Barber App

Sistema de gestión de turnos para barbería profesional construido con Next.js 16, React 19, Prisma y PostgreSQL.

## Características

- 🗓️ Sistema de reserva de turnos online
- 👨‍💼 Panel de administración completo
- 📍 Gestión de múltiples ubicaciones
- ⏰ Horarios personalizables por ubicación
- 💈 Catálogo de servicios
- 📊 Dashboard con estadísticas en tiempo real
- 🔐 Autenticación segura con JWT
- 🎨 Interfaz moderna con animaciones (Framer Motion)
- 📱 Diseño responsive

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, Material-UI
- **Base de datos**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma 5
- **Autenticación**: JWT (jose)
- **Animaciones**: Framer Motion, GSAP
- **Runtime**: Bun
- **Deploy**: Vercel

## Requisitos Previos

- Node.js 20+ o Bun 1.0+
- PostgreSQL (local o Vercel Postgres)

## Instalación Local

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd ventus-app
```

2. Instalar dependencias:
```bash
bun install
```

3. Configurar variables de entorno (copiar `env.example`):
```bash
cp env.example .env.local
```

4. Editar `.env.local` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="tu-secreto-super-largo-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

5. Generar Prisma Client:
```bash
bunx prisma generate
```

6. Ejecutar migraciones:
```bash
bunx prisma migrate deploy
```

7. Seedear la base de datos:
```bash
bun run seed
```

8. Iniciar servidor de desarrollo:
```bash
bun dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

### 1. Crear Base de Datos PostgreSQL

1. Ve a tu proyecto en Vercel
2. Navega a **Storage** → **Create Database**
3. Selecciona **Postgres** → **Continue**
4. Configura el nombre y región
5. Copia las credenciales `DATABASE_URL` y `DIRECT_URL`

### 2. Configurar Variables de Entorno

En tu proyecto de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```
DATABASE_URL=<tu-url-de-postgres-de-vercel>
DIRECT_URL=<tu-direct-url-de-postgres-de-vercel>
JWT_SECRET=<genera-uno-seguro-de-32+-caracteres>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### 3. Deploy

Opción A - **Conectar repositorio Git**:
1. Conecta tu repositorio de GitHub/GitLab/Bitbucket
2. Vercel detectará automáticamente Next.js
3. Click en **Deploy**

Opción B - **Vercel CLI**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Seedear Base de Datos en Producción

Después del primer deploy exitoso:

```bash
# Conectar a tu base de datos de producción
vercel env pull .env.production
bun run seed
```

O ejecuta el seed directamente en Vercel:
```bash
vercel exec bun run seed
```

## Scripts Disponibles

```bash
bun dev          # Desarrollo local
bun build        # Build de producción
bun start        # Servidor de producción
bun run seed     # Seedear base de datos
bun run lint     # Linter
```

## Credenciales de Admin (después del seed)

- **Email**: `ventus@barber.com`
- **Contraseña**: `15651106asd`

🔒 **IMPORTANTE**: Cambia estas credenciales después del primer login en producción.

## Estructura del Proyecto

```
ventus-app/
├── prisma/
│   ├── schema.prisma      # Schema de base de datos
│   └── seed.ts           # Datos iniciales
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── admin/        # Panel de administración
│   │   ├── api/          # API Routes
│   │   └── ...           # Páginas públicas
│   ├── components/       # Componentes reutilizables
│   ├── core/             # Lógica de negocio
│   ├── hooks/            # React hooks custom
│   └── lib/              # Utilidades y helpers
├── public/               # Assets estáticos
└── middleware.ts         # Middleware de autenticación
```

## Rutas Principales

### Públicas
- `/` - Home
- `/services` - Catálogo de servicios
- `/shifts` - Reserva de turnos
- `/confirmed-shifts` - Turnos confirmados públicos

### Admin (protegidas)
- `/admin/login` - Login de administrador
- `/admin/cms` - Dashboard
- `/admin/cms/shifts` - Gestión de turnos
- `/admin/cms/locations` - Gestión de ubicaciones
- `/admin/cms/services` - Gestión de servicios

## Seguridad

- ✅ Autenticación JWT con cookies HTTP-only
- ✅ Middleware de protección en rutas admin
- ✅ Validación de datos con Zod
- ✅ Passwords hasheados con bcrypt
- ✅ Variables de entorno para secretos
- ✅ No hay endpoints públicos para crear admins

## Troubleshooting

### Error: Prisma Client no generado
```bash
bunx prisma generate
```

### Error de migraciones
```bash
bunx prisma migrate reset
bunx prisma migrate deploy
```

### Error de build en Vercel
Verifica que las variables de entorno `DATABASE_URL` y `DIRECT_URL` estén configuradas correctamente.

## Licencia

Privado - Todos los derechos reservados

## Soporte

Para problemas o consultas, contacta al equipo de desarrollo.
