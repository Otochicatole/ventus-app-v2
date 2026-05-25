# 🛠️ 7. Operaciones, Mantenimiento y Escalabilidad

Este documento describe la guía operativa de **Ventus Barber App v2**. Detalla los prerrequisitos de instalación, la configuración de variables de entorno, la administración del motor de persistencia Prisma y ofrece un análisis profundo sobre puntos técnicos críticos, estrategias de escalabilidad y prevención de fallos concurrentes.

---

## 🚀 Puesta en Marcha y Setup Local

La aplicación está optimizada para ejecutarse utilizando el runtime **Bun** (el cual agiliza la resolución de dependencias y ejecución de scripts), pero es totalmente compatible con **Node.js (NPM)**.

### Prerrequisitos
- **Bun** instalado globalmente (`>= 1.0.0`) o **Node.js** (`>= 18.0.0`).
- Base de datos relacional compatible (PostgreSQL para producción y SQLite local/PostgreSQL para desarrollo).

### Paso 1: Instalación de Dependencias
```bash
bun install
```
*(Alternativa NPM: `npm install`)*

### Paso 2: Configuración de Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:

```bash
# URLs de Conexión de Base de Datos (PostgreSQL)
VENTUS_APP_PRISMA_DATABASE_URL="postgresql://usuario:password@localhost:5432/ventus_db?schema=public"
VENTUS_APP_POSTGRES_URL="postgresql://usuario:password@localhost:5432/ventus_db?schema=public"

# Configuración del Sistema de Autenticación JWT
JWT_SECRET="tuhashsecretomuysegurode64caracteresventus"
JWT_EXPIRES_IN="7d"

# Entorno de Ejecución
NODE_ENV="development"
```

### Paso 3: Generación del Cliente de Base de Datos y Sembrado
```bash
# Sincronizar el esquema con la base de datos local y generar tipos
bun run db:push

# Poblar la base de datos con ubicaciones, servicios, horarios y admin semilla
bun run db:seed
```

### Paso 4: Levantar Entorno de Desarrollo
```bash
bun run dev
```
La aplicación cliente y CMS estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Comandos Útiles de Mantenimiento (Prisma)

El archivo `package.json` define scripts simplificados para la gestión diaria de la base de datos:

- **`bun run db:generate`**: Re-compila el cliente estático de Prisma en `src/generated/prisma`. **Debe ejecutarse** siempre que se realicen modificaciones en `schema.prisma`.
- **`bun run db:push`**: Empuja los cambios del esquema directamente a la base de datos sin generar archivos de migración (ideal para desarrollo ágil y prototipos rápidos).
- **`bun run db:seed`**: Ejecuta el archivo transpilado `prisma/seed.ts` para repoblar catálogos.
- **`bun run db:reset`**: Limpia la base de datos por completo (puede provocar pérdida de datos de pruebas), vuelve a empujar el esquema y ejecuta el sembrado (`db:seed`).
- **`bun run db:studio`**: Levanta una interfaz gráfica interactiva en el puerto `5555` para ver, editar y filtrar todas las filas de la base de datos desde el navegador.

---

## ⚠️ Puntos Técnicos Críticos y Mitigación de Errores

### 1. Condiciones de Carrera en Reservas Concurrentes (Race Conditions)
#### El Riesgo:
Dos clientes distintos abren el asistente de reservas al mismo tiempo, eligen la misma sucursal, misma fecha y seleccionan el mismo horario libre (e.g. `10:00` en Palermo). Ambos completan el formulario en simultáneo y pulsan "Reservar" casi al mismo milisegundo.
Dado que las reservas pendientes (`confirmed: false`) no bloquean el horario en las consultas públicas, el sistema podría permitir la inserción en base de datos de ambos turnos pendientes, creando un conflicto de sobre-reserva cuando el administrador intente confirmar ambos.

#### Mitigación Técnica:
Para evitar la sobre-reserva en confirmación, el endpoint administrativo [confirm/route.ts](file:///home/otochi/Desktop/works/ventus-app-v2/src/app/api/admin/shifts/[id]/confirm/route.ts) realiza una validación previa a la actualización:

1. **Restricción Única en Base de Datos**: Se puede implementar a nivel de base de datos una restricción única compuesta `@@unique([locationId, date, time])` sobre turnos **confirmados**. Dado que Prisma no soporta condicionales directos en uniques (`where confirmed = true`), la validación se realiza mediante una transacción de aislamiento en la API:

```typescript
// Transacción de lectura y escritura atómica para confirmar turnos
await prisma.$transaction(async (tx) => {
    const shiftToConfirm = await tx.shift.findUnique({ where: { id } });
    
    // Validar si ya existe otro turno confirmado para la misma hora, fecha y sucursal
    const existingConfirmed = await tx.shift.findFirst({
        where: {
            locationId: shiftToConfirm.locationId,
            date: shiftToConfirm.date,
            time: shiftToConfirm.time,
            confirmed: true,
        }
    });

    if (existingConfirmed) {
        throw new Error("El horario seleccionado ya está ocupado por otro turno confirmado.");
    }

    // Confirmar este turno
    await tx.shift.update({
        where: { id },
        data: { confirmed: true }
    });
});
```

### 2. Invalidación y Caché en Next.js App Router
Por defecto, Next.js realiza un almacenamiento en caché muy agresivo de las rutas de consulta (`GET`).
- **Problema**: Si un cliente reserva un turno, las estadísticas del dashboard o los horarios de alta demanda podrían tardar minutos en actualizarse debido a la caché de renderizado en el servidor.
- **Solución**: Todos los endpoints críticos del sistema (de obtención de slots, cobros, gastos y estadísticas) desactivan el almacenamiento en caché utilizando `cache: "no-store"` en los métodos de red `fetch()` del lado del cliente, y marcando variables de compilación dinámica en el servidor:
  `export const dynamic = "force-dynamic"` y `export const revalidate = 0` en páginas del CMS.

---

## 📈 Recomendaciones para Escalar el Proyecto

Si la barbería escala a nivel de franquicia nacional con miles de solicitudes de reservas simultáneas y millones de registros financieros, se aconseja aplicar las siguientes evoluciones arquitectónicas:

1. **Cola de Mensajería para Reservas**: Mover la creación de turnos pendientes a un sistema de colas asíncronas (e.g., RabbitMQ o BullMQ) para procesar solicitudes por orden de llegada estricto y evitar picos de carga sobre PostgreSQL.
2. **Caché Contable (Redis)**: La suma agregada de cobros y gastos de `ClientPaidService` y `Expense` requiere recorrer miles de filas de base de datos en tiempo real para calcular el balance neto en `/api/finance/summary`. Se recomienda almacenar pre-calculados contables diarios en **Redis** para responder a consultas administrativas en microsegundos.
3. **Trigger de Archivo de Historial**: Mover turnos finalizados e históricos (de años anteriores) a tablas de histórico inactivas, manteniendo la tabla de `Shift` ágil únicamente con turnos activos y del mes en curso.

---

## 🔗 Referencias Cruzadas Internas

- **Estructura Contable**: Para ver cómo se procesan las matemáticas de finanzas que el servidor debe calcular a escala, visita la [Documentación del Módulo Financiero](file:///home/otochi/Desktop/works/ventus-app-v2/agent/finance-module.md).
- **Esquema Prisma**: Para auditar la estructura de tablas que Prisma empuja a base de datos mediante `db:push`, consulta la [Documentación del Esquema de Base de Datos](file:///home/otochi/Desktop/works/ventus-app-v2/agent/database-schema.md).
