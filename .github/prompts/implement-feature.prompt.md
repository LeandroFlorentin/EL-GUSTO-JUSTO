---
description: "Implementa una feature siguiendo un plan ya aprobado (por ejemplo, la salida de /plan-feature), verificando compatibilidad con el repo antes de modificar archivos, ejecutando incrementalmente, validando al final, y reportando en formato fijo"
name: "implement-feature"
argument-hint: "Pega aquí el plan completo aprobado a implementar (salida de /plan-feature u otro plan equivalente)"
agent: "ecommerce-architect"
tools: [read, search, edit, execute, todo]
---

# Implementación de Feature Desde Plan Aprobado

## Rol y Entrada

El texto pegado tras este comando (`/implement-feature`) **ES el plan ya aprobado** que debe ejecutarse. No es un requerimiento nuevo para planificar; es un plan completo (típicamente la salida de `/plan-feature` o un plan equivalente aprobado por el usuario).

**Si el texto pegado es vacío, demasiado breve, o no es reconocible como un plan estructurado**, detente inmediatamente y pide al usuario que pegue el plan completo en lugar de inventar o asumir.

---

## 1. Verificación de Compatibilidad (OBLIGATORIA — antes de tocar archivos)

Antes de modificar, crear o eliminar cualquier archivo, ejecuta esta verificación exhaustiva:

### 1.1. Releer Fuentes de Verdad

- Lee [docs/architecture.md](../../docs/architecture.md) completo o los apartados más relevantes (datos, capas, flujo). ¿Cambió la arquitectura desde que se generó el plan?
- Lee [.github/copilot-instructions.md](../copilot-instructions.md) completo. ¿Cambió alguna regla global o instrucción de proyecto?

### 1.2. Confirmar Estado del Repositorio

Para **cada ruta** mencionada en "Files to Create", "Files to Modify", y "Files to Delete" del plan:

- Usa `read_file` o `list_dir` para confirmar:
  - ¿La ruta ya existe / no existe? (¿Coincide con la asunción del plan?)
  - ¿Su contenido actual es el que el plan asume?
  - ¿Las carpetas padre (ej. `features/<dominio>`, `shared/...`) están en el estado esperado?
- Ejemplos de preguntas concretas:
  - El plan dice "crear `features/favorites/api/...`" pero ¿ya existe `features/favorites/`?
  - El plan asume que `shared/components/Button/` no existe, pero ya está allí con contenido diferente.
  - El plan pide modificar `app/layout.tsx`, ¿qué contiene hoy?

### 1.3. Detectar Divergencias Sustantivas

Si el estado del repo **diverge sustantivamente** de lo que el plan asume (rutas que ya no existen, ya existen con contenido incompatible, capas ya implementadas que el plan no contempla, dependencias ya agregadas/quitadas no mencionadas en el plan, convenciones de proyecto cambiadas):

- **NO decidas unilateralmente** cómo proceder.
- **Reporta la discrepancia concreta** en la sección `# Deviations from Plan` que aparecerá al final.
- **Detén únicamente la rama o paso afectado** de la implementación; continúa con el resto si es independiente.
- Documenta cuál parte del plan quedó bloqueada y por qué.

Si la divergencia es **menor** (ej. el mismo archivo pero con imports reordenados, comentarios diferentes, sin cambio de semántica), procede e indexa la nota como divergencia menor.

---

## 2. Orden de Implementación (Capas)

Sigue el orden definido en [.github/skills/feature-development/SKILL.md](../skills/feature-development/SKILL.md#step-5-implement-in-this-order):

```
1. types/ & schemas/  → Define shape de datos (Zod, TypeScript)
2. api/               → Servicios que comunican con backend/MSW
3. hooks/             → Custom hooks (TanStack Query, estado reutilizable)
4. components/        → UI específica del dominio
5. app/               → Routing, composición, layouts
6. tests/             → Unit / Component / Integration / E2E
```

**Dentro de cada capa**, usa la herramienta `todo` para crear un item por cada archivo o sub-tarea de la sección "Implementation Steps" del plan. Marca cada item como `in-progress` cuando lo inicies, y como `completed` tan pronto como termines.

---

## 3. Reglas de Ejecución (Restricciones Ineludibles)

### 3.1. No Reinterpretar Decisiones del Plan

El plan contiene decisiones sobre:

- Nombres de dominios, rutas, variables, tipos
- Alcance (qué incluir, qué excluir)
- Estructura de capas
- Decisiones explícitas sobre tecnología / patrón

**No cambies silenciosamente estas decisiones.** Si el plan es ambiguo, falta un dato necesario, o encuentras una razón técnica para cambiar algo:

- Detén ese paso específico.
- Reporta la ambigüedad/falta de dato en `# Remaining Issues`.
- Pide clarificación o confirmación del usuario antes de proceder.

### 3.2. Detectar y Bloquear Violaciones Arquitectónicas

Durante la implementación, si detectas **cualquiera** de estos bloqueadores (lista de violaciones críticas definida en `ecommerce-architect.agent.md`):

- ❌ Componente accediendo directo a `/data/`, `/public/`, o haciendo `fetch()` crudo
- ❌ `features/dominio_A/` importando de `features/dominio_B/`
- ❌ `shared/` importando de `features/`
- ❌ Nuevo estado global (Zustand, Redux, etc.) sin agotar React hooks + TanStack Query + URL state
- ❌ Nueva dependencia sin justificación (que el plan no contemple o que no tenga necesidad verificada)

**DETÉN esa parte específica.** No continues esa rama. Reporta la violación concreta en `# Deviations from Plan` con el contexto y por qué se bloqueó.

### 3.3. Agregar Dependencias Solo Cuando Esté Justificado

- Si el plan dice "agregar X dependencia", hazlo si no existe.
- Si el plan dice "usar Y que ya está instalado", úsalo.
- Si durante la implementación **necesitas** una dependencia no mencionada en el plan, **detente primero**:
  - ¿Existe una alternativa ya disponible en `package.json`?
  - ¿Es realmente necesaria o es conveniencia?
  - Reporta la dependencia propuesta en `# Deviations from Plan` con justificación. Procede solo si el usuario lo confirma o si es una dependencia ya instalada que el plan simplemente no mencionó.

### 3.4. Mantener Scope Exacto

- Implementa **solo** lo listado en "Files to Create/Modify/Delete" del plan.
- No modifiques archivos fuera del scope a menos que sea consecuencia directa e inevitable (ej. actualizar un barrel/index existente que ya importa el componente nuevo).
- **NO hagas refactors no relacionados** con el plan ("voy a reorganizar esta carpeta", "voy a mejorar este nombre", etc.).
- Si encuentras código feo o desorganizado fuera del plan, déjalo como está y anotalo en `# Remaining Issues` como mejora futura.

### 3.5. Agregar y Actualizar Tests por Capa

Para cada capa tocada, agrega o actualiza tests siguiendo [.github/skills/testing/SKILL.md](../skills/testing/SKILL.md):

- **types / schemas**: unit tests (Vitest) validando entrada/salida de Zod, casos límite
- **api / servicios**: unit tests (Vitest + MSW) validando request/response, error handling, parsing
- **hooks**: unit + integration tests (Vitest + React Testing Library + MSW), `renderHook`, estado de query
- **components**: component tests (Vitest + React Testing Library), rendering, props, interacción del usuario
- **Flujos críticos**: E2E con Playwright solo si el plan lo pide explícitamente

**Nivel mínimo suficiente**: unit para lógica pura, component con Testing Library para UI, MSW en el límite HTTP. No pruebes implementación interna (nombres de variables, helpers privados, orden de llamadas internas).

---

## 4. Validación Final (Criterios de Aceptación)

**Después de implementar todos los pasos, ejecuta cada comando que esté disponible:**

### 4.1. Lint (Biome)

```bash
pnpm lint
```

Verifica que `biome check .` no reporte errores. (Nota: el hook `PostToolUse` del agente corre `biome check --write` tras cada edición, pero no reemplaza este check final.)

**Resultado esperado**: ✅ Sin errores de linting.

### 4.2. Type Check

```bash
pnpm typecheck
```

Ejecuta `next typegen && tsc --noEmit`. No debe haber errores de TypeScript.

**Resultado esperado**: ✅ Sin errores de tipos. No `any`, no `@ts-ignore` silenciando errores reales.

### 4.3. Tests Unitarios y de Componentes

```bash
pnpm test:run
```

Ejecuta Vitest en modo no-watch. Todos los tests deben pasar, incluyendo los nuevos.

**Resultado esperado**: ✅ Todos los tests pasan.

**Opción**: Si el suite completo es lento, corre solo los tests relevantes:

```bash
pnpm vitest run <ruta-a-tests>
```

### 4.4. Tests E2E (si aplica)

**Antes de ejecutar `pnpm test:e2e`:**

- Verifica si existe `playwright.config.ts` en la raíz del repo.
- Si **NO existe** (estado actual): no ejecutes el comando. Reporta en `# Validation` como "E2E: **no disponible** (falta playwright.config.ts)".
- Si **SÍ existe**: ejecuta `pnpm test:e2e` solo si el plan/cambio afecta un flujo cubierto por E2E (flujo crítico del negocio).

```bash
pnpm test:e2e
```

**Resultado esperado** (si se ejecuta): ✅ Todos los E2E tests relacionados pasan.

### 4.5. Reportar Cualquier Fallo

Si cualquier comando retorna error:

- **Reporta el comando exacto que falló.**
- **Reporta el output completo o resumen del error.**
- **No declares el trabajo como "completado" si hay ❌ en validaciones requeridas.**
- Documenta en `# Remaining Issues` qué necesita corrección.

---

## 5. Formato de Salida (7 Secciones Fijas)

Al finalizar la implementación (o si se bloquea), responde con **exactamente estas 7 secciones**, en este orden:

### # Implemented

Resumen breve de qué se implementó exitosamente y qué no (si algo quedó bloqueado). 1-3 párrafos.

Ejemplo:

```
Se implementó la feature de Favoritos completa: tipos, servicios API, hooks,
componentes UI y pruebas unitarias. La integración con TanStack Query está
operativa y las rutas de app/ componen correctamente la página de Favoritos.

Pendiente: la configuración de E2E no está disponible en el repo, por lo que
no se ejecutó el test end-to-end de la navegación de Favoritos.
```

### # Files Created

Lista de rutas concretas de archivos creados, o `Ninguno`.

Ejemplo:

```
- features/favorites/types/index.ts
- features/favorites/schemas/favorite.schema.ts
- features/favorites/api/favorites.service.ts
- features/favorites/api/index.ts
- features/favorites/hooks/useFavorites.ts
- features/favorites/hooks/index.ts
- features/favorites/components/FavoriteButton/FavoriteButton.tsx
- features/favorites/components/FavoriteButton/FavoriteButton.types.ts
- features/favorites/components/FavoriteButton/FavoriteButton.test.tsx
- features/favorites/components/FavoritesPage/FavoritesPage.tsx
- features/favorites/components/FavoritesPage/FavoritesPage.test.tsx
- app/favoritos/page.tsx
```

### # Files Modified

Lista de rutas concretas de archivos modificados y qué cambió (resumen breve), o `Ninguno`.

Ejemplo:

```
- app/layout.tsx → Agregado Providers con QueryClientProvider para TanStack Query
- shared/components/ProductCard/ProductCard.tsx → Agregado botón para favoritar (usa FavoriteButton)
- package.json → Sin cambios (dependencias ya instaladas)
```

### # Tests Added/Modified

Rutas de archivos `.test.tsx`/`.test.ts` agregados o modificados, y qué escenario cubren.

Ejemplo:

```
- features/favorites/schemas/favorite.schema.test.ts → Unit tests: validar Zod schema con datos válidos/inválidos
- features/favorites/api/favorites.service.test.ts → Unit + MSW: GET/POST/DELETE endpoints, error 404, parsing
- features/favorites/hooks/useFavorites.test.ts → Integration: renderHook, TanStack Query state, data transformation
- features/favorites/components/FavoriteButton/FavoriteButton.test.tsx → Component: click favorita/desfavorita, loading, error
- features/favorites/components/FavoritesPage/FavoritesPage.test.tsx → Component + MSW: lista vacía, lista con items, error
```

### # Validation

Resultado de cada comando ejecutado. Usa ✅ o ❌, y reporta output si hubo error.

Ejemplo:

```
✅ pnpm lint → Biome check passed
✅ pnpm typecheck → No type errors
✅ pnpm test:run → 12 tests passed (8 new, 4 updated)
❌ E2E: no disponible (falta playwright.config.ts en repo)
```

Si un comando falló y es bloqueador, reporta el output relevante:

```
❌ pnpm test:run
Error en features/favorites/hooks/useFavorites.test.ts:
  - Expected toEqual({ id: 1, name: "Test" }) but got undefined
  - Query key mismatch in useQuery() setup
```

### # Deviations from Plan

**Toda desviación**, contradicción arquitectónica detectada, decisión no resuelta unilateralmente, o restricción que hizo falta clarificar, con justificación. O `Ninguno`.

Ejemplo:

```
- El plan asumía que features/favorites/ no existía, pero existe parcialmente con componentes viejos no usados. Se limpió el contenido viejo al crear la feature nueva.
- El plan no mencionaba `@baseui/react` en dependencias, pero estaba ya instalado. Se usó para ciertos componentes (Modal, Popover) sin agregar nuevas dependencias.
- La ruta `app/favoritos/page.tsx` del plan se prefirió cambiar a `app/favorites/page.tsx` (en inglés, consistente con el resto) tras verificar la arquitectura. Fue una **desviación menor del plan** aprobada en base a convención del repo.
```

### # Remaining Issues

Partes del plan **no implementadas**, bloqueadas, o pendientes de decisión/clarificación del usuario. O `Ninguno`.

Ejemplo:

```
- Ninguno. Todo el plan se implementó exitosamente.
```

O:

```
- La integración con MSW para el backend de Favoritos está lista, pero no se creó el mock handler por falta de especificación de endpoints en el plan. Pendiente de que el plan/user confirme qué endpoints debe simular MSW.
- E2E para flujo de agregar a Favoritos desde ProductCard no se ejecutó; requiere playwright.config.ts existente.
```

---

## Resumen de Flujo

```
1. Recibir plan pegado (o error si no hay plan)
    ↓
2. Verificar compatibilidad con repo actual
    ↓
3. Crear lista de TODOs con Implementation Steps del plan
    ↓
4. Implementar por capas: types → api → hooks → components → app → tests
    ↓
5. Ejecutar: lint, typecheck, test:run, (E2E si aplica)
    ↓
6. Reportar en 7 secciones fijas
    ↓
7. Si validaciones tienen ❌, NO declarar completo; reportar bloqueador
```

---

## Consultas si Necesarias

Durante la implementación, si algo es ambiguo o bloqueado:

- **Consulta [docs/architecture.md](../../docs/architecture.md)** para decisiones arquitectónicas.
- **Consulta [.github/skills/feature-development/SKILL.md](../skills/feature-development/SKILL.md)** para estructura de capas / convenciones.
- **Consulta [.github/skills/api-integration/SKILL.md](../skills/api-integration/SKILL.md)** si el plan integra datos externos (esquemas, servicios, hooks, MSW, bootstrap).
- **Consulta [.github/skills/testing/SKILL.md](../skills/testing/SKILL.md)** para nivel/escenarios de test por capa.
- **Consulta [.github/copilot-instructions.md](../copilot-instructions.md)** para convenciones globales de proyecto.

Ante cualquier duda o ambigüedad irremediable, **detén y reporta en `# Remaining Issues`** en vez de inventar.

---

**¡A implementar!**
