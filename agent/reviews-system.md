# Sistema de Reseñas Anónimas (Módulo de Experiencias)

El sistema de reseñas anónimas permite a los visitantes publicar calificaciones (1 a 5 estrellas) y comentarios sobre su experiencia en la barbería de forma pública y anónima, con un historial cronológico visible en tiempo real en la página de inicio.

---

## 💾 1. Modelo de Datos (Prisma)

El modelo de datos se define en [schema.prisma](file:///home/otochi/Desktop/works/ventus-app-v2/prisma/schema.prisma) de forma desacoplada de usuarios o administradores para garantizar el anonimato absoluto de la base de datos:

```prisma
model Review {
  id        String   @id @default(cuid())
  author    String   @default("Anónimo") // Nombre o alias ingresado (por defecto "Anónimo")
  rating    Int      // Calificación numérica del 1 al 5
  comment   String   @db.Text // Comentario de la opinión
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt]) // Índice cronológico para ordenación de consultas optimizada
}
```

---

## 🔌 2. API REST (Contratos y Endpoints)

El controlador de la API reside en [route.ts](file:///home/otochi/Desktop/works/ventus-app-v2/src/app/api/reviews/route.ts).

### 🔍 GET `/api/reviews`
Consulta la lista completa de valoraciones activas.
* **Autenticación**: Ninguna (Acceso público).
* **Ordenación**: Cronológica descendente (`createdAt: "desc"`).
* **Contrato de Salida (200 OK)**:
```json
[
  {
    "id": "cm1234abc",
    "author": "Julián S.",
    "rating": 5,
    "comment": "Excelente atención y un ambiente muy premium. El corte con navaja fue impecable.",
    "createdAt": "2026-05-25T03:40:00.000Z",
    "updatedAt": "2026-05-25T03:40:00.000Z"
  }
]
```

### 📥 POST `/api/reviews`
Crea una nueva reseña en el sistema.
* **Autenticación**: Ninguna (Acceso público).
* **Contrato de Entrada (JSON)**:
```json
{
  "author": "Anónimo (opcional)",
  "rating": 5,
  "comment": "Comentario de prueba..."
}
```
* **Validaciones Estrictas en Servidor (Zod)**:
  - `author`: Cadena opcional. Si viene vacía, con espacios, o nula, Zod la transforma automáticamente en `"Anónimo"`. Longitud máxima de 40 caracteres.
  - `rating`: Entero obligatorio, restringido a valores entre `1` y `5` inclusive.
  - `comment`: Cadena obligatoria. No puede ser un string vacío o de puros espacios. Longitud máxima de 500 caracteres.
* **Respuestas**:
  - `201 Created`: Devuelve el objeto `Review` creado.
  - `400 Bad Request`: Si alguna validación de Zod falla (ej. rating fuera de rango, comentario vacío), devuelve `{ "error": "Detalle del error..." }`.
  - `500 Internal Server Error`: En caso de fallas de base de datos o fallas inesperadas.

---

## 🎨 3. Flujo Visual y UX en Frontend

El componente visual está integrado en la página principal ([page.tsx](file:///home/otochi/Desktop/works/ventus-app-v2/src/app/page.tsx)) y se divide en una distribución asimétrica:

1. **Formulario de Publicación (Izquierda - Columna de 5/12)**:
   - **Selector de Estrellas Interactivo**: Un juego de 5 iconos vectoriales SVG. Los eventos `onMouseEnter` y `onMouseLeave` manejan el estado temporal de previsualización (`hoverRating`), iluminando dinámicamente las estrellas en color Azul Royal Premium (`#0b3a60`). Al hacer click (`onClick`), se fija la puntuación en `formRating` con una micro-escala táctil (`active:scale-90`) sumamente pulida.
   - **Control de Longitud**: El textarea incluye un indicador numérico en tiempo real del límite (`caracteres / 500`).
   - **Estados de Envío**: Durante la llamada asíncrona, el botón se deshabilita y renderiza un spinner de carga minimalista. Los banners informativos de éxito (`emerald`) o error (`red`) aparecen dinámicamente con alertas rectangulares estilo Apple.

2. **Historial de Reseñas (Derecha - Columna de 7/12)**:
   - **Scrollbar Minimalista Limitado**: La lista está contenida en un bloque con scroll vertical restringido (`max-h-[550px] overflow-y-auto`) con scrollbar invisible/fino para preservar la elegancia estructural del layout Apple.
   - **Prepend en Tiempo Real**: Al recibir un código exitoso `201`, el frontend añade la reseña inmediatamente a la cabeza del array local de React (`setReviews((prev) => [newReview, ...prev])`).
   - **Transición Fluida**: Envuelto en `AnimatePresence` de Framer Motion, la nueva reseña realiza una animación de deslizamiento y fade-in (`initial: { opacity: 0, y: -20, height: 0 }, animate: { opacity: 1, y: 0, height: "auto" }`) impecable y libre de tirones.
