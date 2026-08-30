# Ecommerce Frontend

Frontend de ecommerce desarrollado con **Next.js, React y TypeScript**, diseñado con una arquitectura modular y escalable.

La primera versión utiliza información de productos almacenada localmente en JSON, pero simula la comunicación con una API mediante **MSW (Mock Service Worker)**. Esto permite reemplazar posteriormente los mocks por un backend real sin modificar la lógica de los componentes.

---

## Stack tecnológico

| Área               | Tecnología      | Responsabilidad                          |
| ------------------ | --------------- | ---------------------------------------- |
| Framework          | Next.js 16      | Routing, rendering y optimizaciones      |
| UI                 | React 19        | Desarrollo de componentes                |
| Lenguaje           | TypeScript      | Tipado estático                          |
| Estilos            | Tailwind CSS    | Estilos y responsive design              |
| Componentes        | shadcn/ui       | Componentes reutilizables                |
| Server State       | TanStack Query  | Requests, cache y sincronización         |
| Validación         | Zod             | Validación de contratos y datos externos |
| Mock API           | MSW             | Simulación del backend                   |
| Linter / Formatter | Biome           | Calidad y formato de código              |
| Unit Testing       | Vitest          | Tests unitarios                          |
| Component Testing  | Testing Library | Tests de componentes React               |
| E2E Testing        | Playwright      | Tests de flujos completos                |
| Git Hooks          | Husky           | Ejecución automática de validaciones     |
| Staged Files       | lint-staged     | Validaciones sobre archivos modificados  |
| Commits            | Commitlint      | Convención de mensajes de commit         |
| Package Manager    | pnpm            | Gestión de dependencias                  |

---

# Arquitectura

La aplicación está organizada principalmente por **features**, evitando centralizar todos los componentes, hooks y servicios del proyecto en carpetas globales.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── providers.tsx
│
├── features/
│   └── products/
│       ├── api/
│       │   ├── get-products.ts
│       │   └── get-product.ts
│       ├── components/
│       │   ├── ProductCard.tsx
│       │   ├── ProductGrid.tsx
│       │   └── ProductFilters.tsx
│       ├── hooks/
│       │   ├── use-products.ts
│       │   └── use-product.ts
│       ├── schemas/
│       │   └── product.schema.ts
│       └── types/
│           └── product.ts
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
│
├── mocks/
│   ├── handlers/
│   └── browser.ts
│
└── data/
    └── products.json
```

## Responsabilidad de cada capa

### `app/`

Responsable principalmente de:

- Routing.
- Layouts.
- Providers.
- Composición de páginas.
- Configuración propia de Next.js.

Las páginas deben evitar contener lógica de negocio innecesaria.

### `features/`

Contiene las funcionalidades principales de la aplicación.

Ejemplos futuros:

```text
features/
├── products/
├── cart/
├── checkout/
├── orders/
├── auth/
├── favorites/
└── search/
```

Cada feature contiene los componentes, hooks, schemas, tipos y comunicación con API correspondientes a ese dominio.

### `shared/`

Contiene funcionalidades genéricas que no pertenecen a un dominio particular.

Ejemplos:

```text
shared/
├── components/
│   ├── Button
│   ├── Modal
│   ├── Spinner
│   └── EmptyState
│
├── hooks/
├── lib/
└── utils/
    ├── format-money.ts
    └── format-date.ts
```

La dirección general de dependencias debe mantenerse:

```text
app
 ↓
features
 ↓
shared
```

`shared` no debe depender de features específicas.

---

# Comunicación con API

Aunque inicialmente los productos se encuentran almacenados en un JSON local, los componentes no deben acceder directamente al archivo.

Se utilizará la siguiente arquitectura:

```text
Component
    ↓
Custom Hook
    ↓
TanStack Query
    ↓
API Service
    ↓
HTTP Request
    ↓
MSW
    ↓
products.json
```

Ejemplo:

```text
ProductGrid
    ↓
useProducts()
    ↓
getProducts()
    ↓
GET /api/products
    ↓
MSW
    ↓
products.json
```

Esto permite desarrollar el frontend como si existiera un backend real.

Cuando el backend sea implementado:

```text
ProductGrid
    ↓
useProducts()
    ↓
getProducts()
    ↓
GET https://api.example.com/v1/products
    ↓
Backend
    ↓
Database
```

Los componentes de presentación no deberían necesitar modificaciones.

---

# Validación de datos

Los datos provenientes de APIs deben considerarse externos y validarse antes de ingresar a la aplicación.

Para esto se utiliza **Zod**.

Ejemplo:

```typescript
import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  image: z.string(),
  category: z.string(),
  available: z.boolean(),
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
```

Flujo:

```text
External Data
     ↓
    Zod
     ↓
Validated Data
     ↓
Application
```

Esto complementa a TypeScript proporcionando validación en runtime.

---

# Mock API

Se utiliza **MSW (Mock Service Worker)** para simular la comunicación HTTP con el futuro backend.

Los datos iniciales se encuentran en:

```text
src/data/products.json
```

MSW intercepta requests como:

```text
GET /api/products
GET /api/products/:id
```

y devuelve la información almacenada localmente.

También permite simular escenarios como:

- Loading.
- Latencia.
- HTTP 400.
- HTTP 404.
- HTTP 500.
- Respuestas vacías.
- Productos inexistentes.

Esto permite desarrollar correctamente los diferentes estados de la UI antes de contar con un backend real.

---

# Gestión de estado

Se diferencian tres tipos principales de estado.

## Server State

Información proveniente del backend:

```text
products
categories
orders
stock
```

Se administra mediante:

```text
TanStack Query
```

## Client State

Estado exclusivamente relacionado con la interfaz:

```text
modal abierto
sidebar
theme
estado temporal de componentes
```

Inicialmente se utilizarán las herramientas propias de React.

Se podrá incorporar Zustand posteriormente si aparece una necesidad real de estado global.

## URL State

Filtros, búsquedas, ordenamiento y paginación deben almacenarse preferentemente en la URL.

Ejemplo:

```text
/products?category=ropa&sort=price&page=2
```

Esto permite compartir y recuperar fácilmente el estado de una búsqueda.

---

# Calidad de código

Se utilizan diferentes niveles de validación dependiendo de la operación realizada.

## Pre-commit

El pre-commit debe ser rápido.

```text
git commit
    ↓
Husky
    ↓
lint-staged
    ↓
Biome
    ├── lint
    └── format
```

Solo se analizan los archivos modificados.

Herramientas:

```text
Husky
lint-staged
Biome
```

Ejemplo:

```bash
pnpm lint-staged
```

---

# Commitlint

Los mensajes de commit utilizan **Conventional Commits**.

Ejemplos válidos:

```text
feat: add product listing

feat: add product detail page

fix: handle unavailable products

refactor: extract product card

test: add product service tests

chore: configure msw
```

El flujo es:

```text
git commit
    ↓
pre-commit
    │
    ├── lint-staged
    └── Biome
    ↓
commit-msg
    ↓
Commitlint
```

---

# Pre-push

Antes de realizar un push se ejecutan controles más costosos.

```text
git push
   ↓
TypeScript
   ↓
Unit Tests
```

Comandos:

```bash
pnpm typecheck
pnpm test:run
```

Esto permite detectar:

- Errores de TypeScript.
- Tests rotos.
- Cambios incompatibles.

---

# Pull Request / CI

La validación completa se realiza en CI.

```text
Pull Request
      ↓
Install Dependencies
      ↓
Lint
      ↓
Type Check
      ↓
Unit Tests
      ↓
Build
      ↓
E2E Tests
```

Comandos:

```bash
pnpm install --frozen-lockfile

pnpm lint

pnpm typecheck

pnpm test:run

pnpm build

pnpm test:e2e
```

El objetivo es impedir que código que no cumpla estas validaciones pueda integrarse a las ramas protegidas.

---

# Testing

La estrategia de testing se divide en diferentes niveles.

### Unit Tests

Herramienta:

```text
Vitest
```

Para probar principalmente:

- Funciones.
- Transformaciones.
- Validaciones.
- Utilidades.
- Lógica aislada.

### Component Tests

Herramientas:

```text
Vitest
+
React Testing Library
```

Para probar:

- Renderizado.
- Interacciones.
- Estados de componentes.
- Formularios.
- Loading.
- Errores.

### API Mocking

Herramienta:

```text
MSW
```

Permite utilizar los mismos contratos HTTP durante desarrollo y testing.

### E2E

Herramienta:

```text
Playwright
```

Para validar flujos completos.

Ejemplo futuro:

```text
Home
 ↓
Products
 ↓
Product Detail
 ↓
Add to Cart
 ↓
Cart
 ↓
Checkout
```

Los tests E2E no se ejecutan durante cada commit debido a su mayor costo.

---

# Scripts

El proyecto deberá exponer como mínimo los siguientes scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",

    "lint": "biome check .",
    "lint:fix": "biome check --write .",

    "typecheck": "tsc --noEmit",

    "test": "vitest",
    "test:run": "vitest run",

    "test:e2e": "playwright test",

    "prepare": "husky"
  }
}
```

---

# Git Hooks

La configuración esperada es:

```text
.husky/
├── pre-commit
├── pre-push
└── commit-msg
```

## Pre-commit

```bash
pnpm lint-staged
```

## Pre-push

```bash
pnpm typecheck
pnpm test:run
```

## Commit Message

```bash
pnpm commitlint --edit "$1"
```

---

# Estrategia de validación

```text
                    DEVELOPMENT
                         │
                         ▼
                 Next.js + React
                         │
                     TypeScript
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
             UI                     DATA
             │                       │
     Tailwind + shadcn        TanStack Query
                                     │
                                    Zod
                                     │
                                    MSW
                                     │
                              products.json


                  QUALITY PIPELINE
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
       COMMIT           PUSH            PR
          │              │              │
        Biome       TypeScript        Biome
      Commitlint      Vitest        TypeScript
                                    Vitest
                                     Build
                                   Playwright
```

---

# Principios

El proyecto seguirá los siguientes principios:

- Organización por dominio/feature.
- Componentes desacoplados del origen de los datos.
- Validación de datos externos.
- TypeScript en modo estricto.
- Separación entre Server State, Client State y URL State.
- Hooks de Git rápidos durante el desarrollo.
- Validaciones completas en CI.
- No incorporar dependencias hasta que exista una necesidad concreta.
- Mantener componentes pequeños y con responsabilidades claras.
- Preparar la comunicación HTTP desde el inicio aunque inicialmente se utilicen datos mockeados.
- Facilitar la futura integración con un backend sin reestructurar el frontend.

---

# Evolución prevista

## Fase 1 — Frontend

```text
Next.js
React
TypeScript
Tailwind
shadcn/ui
TanStack Query
Zod
MSW
products.json
```

## Fase 2 — Backend

MSW y el JSON local serán reemplazados progresivamente por una API real.

```text
Frontend
    ↓
API
    ↓
Backend
    ↓
Database
```

La arquitectura del frontend está diseñada para que este cambio afecte principalmente a la capa de comunicación con API y no a los componentes de presentación.

## Fase 3 — Ecommerce completo

La arquitectura podrá crecer incorporando nuevas features:

```text
features/
├── products/
├── categories/
├── search/
├── cart/
├── checkout/
├── payments/
├── orders/
├── auth/
├── favorites/
└── reviews/
```

Cada nueva funcionalidad deberá mantenerse encapsulada dentro de su dominio correspondiente.
