# Ventus Barber App - Memoria Técnica de Agente (CMS & Client App)

¡Bienvenido! Este directorio (`agent/`) contiene la documentación técnica estructurada y persistente de **Ventus Barber App v2**. Ha sido diseñado específicamente para que desarrolladores e Inteligencias Artificiales comprendan al 100% el diseño del sistema, la lógica de negocio, las APIs y la arquitectura general del proyecto sin tener que leer todo el código fuente desde cero.

Cada archivo documenta en profundidad un módulo o dominio específico del sistema. Los documentos están interconectados para facilitar la navegación rápida y exhaustiva.

---

## 🗺️ Mapa de Navegación de la Documentación

| Documento | Dominio / Feature | Descripción Clave |
| :--- | :--- | :--- |
| [📂 1. Arquitectura General](file:///home/otochi/Desktop/works/ventus-app-v2/agent/architecture.md) | Arquitectura y Core | Next.js App Router (React 19), estructura de carpetas, diseño premium con Three.js, GSAP y Tailwind v4. |
| [🔐 2. Autenticación y Autorización](file:///home/otochi/Desktop/works/ventus-app-v2/agent/auth-system.md) | Seguridad | Firmado de tokens custom con JWT/Jose, cookies HTTP-only, Middleware de Next.js y guardias en APIs. |
| [🗄️ 3. Esquema de Base de Datos](file:///home/otochi/Desktop/works/ventus-app-v2/agent/database-schema.md) | Persistencia | Modelos de Prisma (PostgreSQL), relaciones (Ubicaciones-Turnos-Horarios), índices y estrategia de seeding. |
| [📅 4. Asistente de Reserva de Turnos](file:///home/otochi/Desktop/works/ventus-app-v2/agent/booking-flow.md) | Reserva de Clientes | Flow paso a paso de `/shifts`, algoritmo de slots ocupados/libres, y slots en "Alta Demanda". |
| [💼 5. Módulo Financiero y Clean Arch](file:///home/otochi/Desktop/works/ventus-app-v2/agent/finance-module.md) | Finanzas y Gastos | Lógica matemática para recurrencia de gastos fijos mensuales (`getFixedExpenseOccurrences`), balance financiero y estructura Clean. |
| [📊 6. CMS de Administración](file:///home/otochi/Desktop/works/ventus-app-v2/agent/cms-dashboard.md) | Panel de Control | Administración de turnos, ubicaciones, notas de clientes, bloqueos y endpoints de estadísticas. |
| [⭐ 7. Sistema de Reseñas Anónimas](file:///home/otochi/Desktop/works/ventus-app-v2/agent/reviews-system.md) | Reseñas de Clientes | Canal de opiniones públicas anónimas con validaciones de Zod e inserción reactiva en el frontend. |
| [🛠️ 8. Operaciones y Escalabilidad](file:///home/otochi/Desktop/works/ventus-app-v2/agent/operations.md) | Operaciones | Inicio en local (Bun), variables de entorno (.env), mantenimiento de la base de datos y estrategias de escalabilidad. |
| [🗺️ 9. Mapa Interactivo](file:///home/otochi/Desktop/works/ventus-app-v2/agent/map-integration.md) | Ubicaciones / Mapas | Visualización tridimensional de sucursales con deck.gl y MapLibre GL JS, cálculos de centroide y flyTo. |

---

## 🛠️ Resumen Tecnológico de la Aplicación

- **Frontend & Backend**: Next.js v16.1.1 (App Router) y React v19.2.3.
- **Base de Datos**: PostgreSQL + Prisma Client ORM.
- **Autenticación**: Custom JWT signed using `jose` + `bcryptjs` for security.
- **3D & Animación**: Three.js, GSAP (GreenSock), Framer Motion en Landing Page para un diseño Premium High-Fidelity.
- **Estilos**: Tailwind CSS v4 + Material UI (MUI) con configuraciones estéticas personalizadas en base a HSL.
- **Validación de Datos**: Zod Schemas.

---

## 🤖 Directrices para Agentes de IA

Cuando trabajes en este repositorio, ten en cuenta las siguientes directivas obligatorias:

1. **Mantener la Sincronización**: Si agregas, modificas o eliminas un endpoint, una tabla en el esquema de base de datos, un tipo o un flujo de negocio, **debes actualizar obligatoriamente** el archivo correspondiente dentro de esta carpeta `agent/`.
2. **Priorizar Arquitectura Limpia**: El módulo financiero (`src/features/expenses`) sigue principios de Clean Architecture (Domain, Hooks, Infrastructure, UI). Cualquier extensión de gastos o cobros debe seguir rigurosamente este patrón.
3. **Consistencia de Seguridad**: Cualquier nuevo endpoint administrativo bajo `/api/admin` o `/api/finance` **debe** incluir una llamada a `await requireAuth()` al inicio de su ejecución para evitar fugas de información.

Para comenzar a comprender el funcionamiento del sistema, inicia la lectura por la [Guía de Arquitectura General](file:///home/otochi/Desktop/works/ventus-app-v2/agent/architecture.md).
