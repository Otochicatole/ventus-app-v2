# 📊 6. CMS de Administración y Contratos de APIs

Este documento describe la estructura del **Panel de Administración (CMS)** de **Ventus Barber App v2** ubicado en `/admin/cms`. Detalla los componentes responsivos del panel, las consultas agregadas del servidor y la especificación de todos los endpoints administrativos protegidos de la aplicación.

---

## 🎨 Layout y Navegación Responsiva del CMS

El CMS proporciona un espacio de trabajo unificado y responsivo a través de dos archivos clave:

### 1. Sidebar Inteligente (`Sidebar.tsx`)
Adapta la navegación según el tamaño de la pantalla física del dispositivo:
- **Computadora de Escritorio (Desktop - `hidden md:block`)**: Barra lateral fija a la izquierda con 64px de ancho (`w-64`). Contiene enlaces grandes con iconos ilustrativos de `lucide-react` para acceso inmediato.
- **Dispositivo Móvil (Mobile - `md:hidden`)**: Barra de navegación inferior fija (`fixed bottom-0`). Proporciona botones táctiles horizontales con scrolling automático y un indicador superior de color azul que resalta el enlace activo.

### 2. Barra de Navegación del Panel (`AdminNavbar.tsx`)
Se sitúa fija en la cabecera superior (`h-16`). Muestra las siglas o avatar del administrador autenticado, su correo electrónico, y dispone del botón de salida rápida **"Salir"** que realiza un `POST /api/admin/logout` y redirige a la pantalla de login.

---

## 📊 Consulta Agregada de Estadísticas en el Servidor

El panel de control principal del administrador ([cms/page.tsx](file:///home/otochi/Desktop/works/ventus-app-v2/src/app/admin/cms/page.tsx)) se ejecuta como un **Server Component (RSC)** dinámico. Esto elimina la necesidad de peticiones HTTP locales y acelera el tiempo de carga agregando estadísticas directamente de PostgreSQL mediante llamadas simultáneas con Prisma:

```typescript
const [
    totalLocations,
    totalShifts,
    confirmedShifts,
    pendingShifts,
    todayShifts,
    recentShifts,
] = await Promise.all([
    prisma.location.count(),
    prisma.shift.count({ where: { date: { gte: today } } }),
    prisma.shift.count({ where: { confirmed: true, date: { gte: today } } }),
    prisma.shift.count({ where: { confirmed: false, date: { gte: today } } }),
    prisma.shift.count({ where: { date: { gte: today, lt: tomorrow } } }),
    prisma.shift.findMany({
        where: { date: { gte: today } },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { location: true },
    }),
]);
```

Estas variables alimentan las tarjetas informativas de totales en el dashboard en tiempo de renderizado inicial en el servidor.

---

## 📇 Contratos de la API Backend

Todos los endpoints administrativos requieren autenticación. A continuación, se detallan las firmas de contrato de las APIs operativas del sistema:

### 1. Gestión de Turnos (`Shifts`)

#### A. Cambiar Estado de Confirmación
Actualiza si un turno ha sido validado para bloquear el slot horario definitivamente.
- **Ruta**: `PATCH /api/admin/shifts/[id]/confirm`
- **Body**: `{ confirmed: boolean }`
- **Retorno**: Registro del turno actualizado.

#### B. Guardar Notas Internas
Añade anotaciones y detalles clínicos o de corte del cliente.
- **Ruta**: `PATCH /api/admin/shifts/[id]/notes`
- **Body**: `{ notes: string }`
- **Retorno**: Registro del turno actualizado.

#### C. Cancelar Turno
Elimina por completo el registro de la cita para liberar el horario.
- **Ruta**: `DELETE /api/shifts/[id]`
- **Retorno**: `{ success: true }`

---

### 2. Fechas Bloqueadas (`UnavailableDates`)
Bloquea días completos por sucursal física.

#### A. Obtener Bloqueos de una Sucursal
- **Ruta**: `GET /api/unavailable-dates?locationId={id}`
- **Retorno**: Array de objetos `UnavailableDate`.

#### B. Bloquear una Fecha Nueva
- **Ruta**: `POST /api/unavailable-dates`
- **Body**: `{ date: "YYYY-MM-DD", locationId: string }`
- **Retorno**: Registro creado en la base de datos.

#### C. Desbloquear Fecha
- **Ruta**: `DELETE /api/unavailable-dates/[id]`
- **Retorno**: `{ success: true }`

---

### 3. Plantillas de Horarios (`TimeSlots`)
Administra los horarios permitidos en la agenda de atención.

#### A. Crear Horario para Sucursal
- **Ruta**: `POST /api/time-slots`
- **Body**: `{ time: "HH:MM", locationId: string }`
- **Retorno**: Registro creado.

#### B. Eliminar Horario
- **Ruta**: `DELETE /api/time-slots/[id]`
- **Retorno**: `{ success: true }`

---

### 4. Módulo Financiero (`Finance`)

#### A. Resumen Financiero Consolidado
Endpoint que alimenta la gráfica contable y calcula el presupuesto sumando cobros y restando gastos variables y proyecciones de fijos.
- **Ruta**: `GET /api/finance/summary`
- **Query Params**:
  - `period`: `"week" | "month" | "year"` (Preset temporal)
  - `date`: `"YYYY-MM-DD"` (Referencia opcional)
  - `startDate`/`endDate`: `"YYYY-MM-DD"` (Rango de fechas customizado)
- **Retorno**: `SummaryResponse` con balances, cantidad de transacciones y breakdown detallado de gastos fijos.

#### B. Log de Cobros a Clientes (`ClientPaidServices`)
- **Rutas**:
  - `GET /api/client-paid-services?startDate=...&endDate=...` (Lista cobros en rango)
  - `POST /api/client-paid-services` (Crea cobro: `{ fullName, payment, description, servicesPerformed }`)
  - `PUT /api/client-paid-services/[id]` (Edita cobro)
  - `DELETE /api/client-paid-services/[id]` (Elimina cobro)

#### C. Gastos Variables (`Expenses`)
- **Rutas**:
  - `GET /api/expenses?startDate=...&endDate=...` (Lista gastos en rango)
  - `POST /api/expenses` (Crea gasto variable: `{ name, amount, description, spentAt }`)
  - `PUT /api/expenses/[id]` (Edita gasto)
  - `DELETE /api/expenses/[id]` (Elimina gasto)

#### D. Gastos Fijos (`FixedExpenses`)
- **Rutas**:
  - `GET /api/fixed-expenses` (Lista todas las plantillas de gastos fijos)
  - `POST /api/fixed-expenses` (Crea plantilla: `{ name, amount, description, startsAt }`)
  - `PUT /api/fixed-expenses/[id]` (Edita plantilla)
  - `DELETE /api/fixed-expenses/[id]` (Elimina plantilla)

---

## 🔗 Referencias Cruzadas Internas

- **Flujo de Reservas**: Para ver cómo impacta la confirmación de turnos en las consultas del cliente, revisa la [Documentación del Asistente de Turnos](file:///home/otochi/Desktop/works/ventus-app-v2/agent/booking-flow.md).
- **Algoritmo de Finanzas**: Para comprender cómo se utiliza `/api/finance/summary` en la lógica matemática de presupuestos, visita la [Documentación del Módulo Financiero](file:///home/otochi/Desktop/works/ventus-app-v2/agent/finance-module.md).
