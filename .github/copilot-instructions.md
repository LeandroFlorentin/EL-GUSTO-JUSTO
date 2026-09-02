# Copilot Instructions — Frontend (Ecommerce)

> Fuente de verdad arquitectónica: `docs/architecture.md`. Ante cualquier decisión
> arquitectónica relevante (nueva feature, reorganización de carpetas, cambio de
> estrategia de datos/estado), consultar ese documento antes de decidir por tu cuenta.

## Stack real (verificado en package.json)

Next.js 16, React 19, TypeScript estricto, Tailwind CSS 4, shadcn/ui, TanStack Query 5,
Zod 4, MSW 2, Vitest 4 + Testing Library, Playwright, Biome 2, Husky + lint-staged,
Commitlint, pnpm.

## Estado actual del repo (no asumir más de lo que existe)

- No hay carpeta `src/`: `app/` y `shared/` viven en la raíz del repo. El alias `@/*`
  apunta a la raíz (ver `tsconfig.json`).
- `features/` aún no existe. Al crearla, seguir la estructura de
  `docs/architecture.md` (`api/`, `components/`, `hooks/`, `schemas/`, `types/`).
- `mocks/` y `data/` (para MSW) aún no existen; MSW está instalado pero no integrado.
- shadcn está configurado (`components.json`) pero sus carpetas de salida
  (`components/ui`, `lib`, `hooks`) todavía no se generaron.

## Arquitectura

1. Dirección de dependencias: `app → features → shared`. Nunca al revés;
   `shared` no puede importar nada de `features/*`.
2. `app/` solo contiene routing, layouts, providers y composición de páginas.
   Si una página necesita lógica de negocio, extraerla a la feature correspondiente.
3. El código específico de un dominio vive en su `features/<nombre>/`. Mover algo a
   `shared/` solo cuando sea genuinamente reutilizable e independiente de todo dominio.
4. Los componentes de presentación deben estar desacoplados del origen de los datos
   (no deben saber si vienen de MSW, JSON local o una API real).

## Datos y estado

5. Ningún componente accede directamente a JSON/fetch crudo: siempre
   Component → hook → TanStack Query → servicio API (ver "Comunicación con API" en
   `docs/architecture.md`).
6. Todo dato externo (API/mocks) se valida con Zod antes de usarse; no confiar solo
   en los tipos de TypeScript.
7. El server state se maneja con TanStack Query, no con `useState`/`useEffect`.
8. Filtros, búsqueda, orden y paginación se reflejan en la URL cuando la interacción
   deba ser compartible o recuperable.

## Calidad y dependencias

9. TypeScript estricto: no usar `any` ni `@ts-ignore` para silenciar errores reales.
10. Biome es el único linter/formatter del proyecto; no introducir ESLint/Prettier
    en paralelo sin justificarlo.
11. No agregar una dependencia nueva sin una necesidad concreta ya presente en el
    código.
12. Mantener componentes pequeños con una responsabilidad clara; dividirlos dentro
    de su feature/carpeta si crecen demasiado.
13. Seguir la convención de carpeta por componente ya usada en `shared/`
    (`Nombre/Nombre.tsx`, `Nombre.types.ts`, `Nombre.test.tsx`).

## Testing y Git hooks (lo que realmente está configurado)

14. Unit/lógica → Vitest. Componentes → Vitest + Testing Library. Flujos completos →
    Playwright. No mezclar niveles de test.
15. Pre-commit real (`.husky/pre-commit`): `pnpm lint-staged` y `pnpm test` deben pasar.
16. Pre-push real (`.husky/pre-push`): `pnpm typecheck`, `pnpm test:run` y `pnpm build`
    deben pasar.
17. Commits en formato Conventional Commits (`commitlint.config.mjs`): tipos permitidos
    `feat, fix, refactor, perf, test, docs, style, build, ci, chore, revert`.
