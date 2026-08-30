# Ecommerce Frontend

Frontend de ecommerce desarrollado con **Next.js, React y TypeScript**.

El proyecto está diseñado para comenzar utilizando datos locales y una API simulada, manteniendo una estructura preparada para integrarse con un backend real en futuras etapas.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zod
- MSW
- Biome
- Vitest
- React Testing Library
- Playwright
- Husky
- lint-staged
- Commitlint
- pnpm

## Requisitos

Antes de comenzar, asegurarse de tener instalado:

- Node.js
- pnpm
- Git

Verificar las versiones instaladas:

```bash id="dlfyqo"
node --version
pnpm --version
git --version
```

## Instalación

Clonar el repositorio:

```bash id="9h0bgw"
git clone <repository-url>
```

Ingresar al proyecto:

```bash id="ulvj8x"
cd <project-name>
```

Instalar dependencias:

```bash id="78ptdc"
pnpm install
```

## Desarrollo

Levantar el entorno local:

```bash id="6nf8vc"
pnpm dev
```

La aplicación estará disponible por defecto en:

```text id="fzdd4s"
http://localhost:3000
```

## Scripts

### Desarrollo

```bash id="i42q83"
pnpm dev
```

Inicia el servidor de desarrollo.

### Build

```bash id="xxjjnn"
pnpm build
```

Genera el build de producción.

### Lint

```bash id="glqhwv"
pnpm lint
```

Ejecuta las validaciones de Biome.

Para aplicar correcciones automáticamente:

```bash id="5wsuj7"
pnpm lint:fix
```

### Type Check

```bash id="44lcz4"
pnpm typecheck
```

Ejecuta la validación de tipos de TypeScript sin generar archivos.

### Tests

Ejecutar tests en modo desarrollo:

```bash id="60vbpc"
pnpm test
```

Ejecutar todos los tests una vez:

```bash id="21wuz3"
pnpm test:run
```

### E2E

```bash id="s49zm1"
pnpm test:e2e
```

Ejecuta los tests End-to-End utilizando Playwright.

## Estructura

La aplicación utiliza una arquitectura modular organizada principalmente por features.

```text id="kikiyh"
src/
├── app/
├── features/
├── shared/
├── mocks/
└── data/
```

La documentación detallada de arquitectura se encuentra en:

```text id="3xd5q1"
docs/architecture.md
```

## Datos y API

Durante la primera etapa, la aplicación utiliza información local de productos.

```text id="a4ls6k"
src/data/products.json
```

La comunicación con el backend es simulada mediante **MSW (Mock Service Worker)**.

Esto permite que los componentes consuman los datos mediante requests HTTP sin depender directamente del archivo JSON.

En futuras versiones, los mocks serán reemplazados por una API real.

## Variables de entorno

Las variables locales deben definirse utilizando:

```text id="rzqmrh"
.env.local
```

Ejemplo:

```env id="slnbkb"
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

No se deben versionar archivos que contengan credenciales o información sensible.

Cuando sea necesario documentar nuevas variables, agregarlas a:

```text id="id4i4g"
.env.example
```

## Git

El proyecto utiliza:

- Husky
- lint-staged
- Commitlint

Antes de cada commit se ejecutan automáticamente las validaciones configuradas para los archivos modificados.

Antes de cada push se ejecutan validaciones adicionales como TypeScript y tests.

Los commits utilizan **Conventional Commits**.

Ejemplos:

```text id="b5q4x1"
feat: add product listing
fix: handle product loading error
refactor: extract product card
test: add product tests
docs: update readme
chore: update dependencies
```

## Pull Requests

Antes de crear un Pull Request se recomienda ejecutar:

```bash id="mj96xs"
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

La integración continua puede ejecutar adicionalmente los tests E2E:

```bash id="12fajf"
pnpm test:e2e
```

## Documentación

La documentación técnica del proyecto se encuentra dentro de:

```text id="6plx89"
docs/
```

Documentos disponibles:

```text id="6dhx0g"
docs/
└── architecture.md
```

A medida que el proyecto crezca, se podrán agregar documentos específicos para testing, APIs, deployment y decisiones técnicas.
