# Guía de uso de Prompts (Copilot)

Prompts disponibles en `.github/prompts/`, todos usan el agent `ecommerce-architect`
(`.github/agents/ecommerce-architect.agent.md`).

## Flujo general

```
/plan-feature  →  (revisión humana del plan)  →  /implement-feature  →  /create-tests (si falta cobertura)
```

## `/plan-feature`

**Uso:** `/plan-feature <descripción de la feature>`

Ejemplo:

```
/plan-feature Implementar favoritos persistidos localmente
```

- Solo planifica: no crea, modifica ni elimina archivos, no ejecuta comandos.
- Investiga primero `docs/architecture.md`, `.github/copilot-instructions.md`,
  el dominio afectado (`features/<nombre>` o `shared/`) y tests existentes.
- Entrega un plan con secciones fijas: Requirement, Existing Architecture Analysis,
  Affected Domain, Data Flow, Files to Create/Modify/Delete, Implementation Steps,
  Testing Strategy, Risks/Decisions, Definition of Done.
- **Revisa y aprueba el plan manualmente** antes de pasarlo a `/implement-feature`.

## `/implement-feature`

**Uso:** pega el plan completo aprobado (salida de `/plan-feature`) como argumento.

```
/implement-feature
<pegar aquí el plan completo generado por /plan-feature>
```

- Antes de tocar archivos, releen `docs/architecture.md` y `copilot-instructions.md`,
  y verifica que el estado real del repo coincide con lo que el plan asume.
- Implementa en orden de capas: `types/schemas → api → hooks → components → app → tests`.
- Usa `todo` para trackear cada paso del plan.
- Bloquea (no ignora) violaciones arquitectónicas (fetch crudo en componentes,
  imports cruzados entre features, `shared` importando de `features`, nuevo estado
  global sin justificar, dependencias nuevas sin necesidad verificada) y las reporta
  en `# Deviations from Plan` en vez de decidir por su cuenta.
- Al final corre y reporta: `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, y
  `pnpm test:e2e` solo si existe `playwright.config.ts`.
- Responde con 7 secciones fijas (Implemented, Deviations from Plan, Remaining Issues,
  Validation, etc.).

## `/create-tests`

**Uso:** `/create-tests <ruta o nombre del código a analizar>`

Ejemplos:

```
/create-tests features/favorites/hooks/useFavorites.ts
/create-tests FavoriteButton
/create-tests shared/components/Header
```

- Solo agrega tests; **nunca modifica código de producción**.
- Sigue `.github/skills/testing/SKILL.md`: inspecciona el código, tests existentes,
  clasifica el nivel de test adecuado (Vitest unit, RTL, MSW, Playwright) y el riesgo.
- Muestra siempre una tabla `Behavior | Risk | Test Type | Existing Coverage | Action`
  antes de implementar, y solo escribe tests para filas `Action = Implement`.
- Evita coverage artificial: no testea implementación interna, snapshots amplios,
  ni comportamiento ya cubierto por otra capa.
- Corre `pnpm vitest run <ruta-afectada>` tras crear/modificar los tests.
- Si un test requeriría cambiar producción (ej. falta un `aria-label`), no lo hace:
  lo reporta en `# Intentionally Not Tested` con el motivo.

## Notas

- Todos los prompts dependen de que `docs/architecture.md` y
  `.github/copilot-instructions.md` estén actualizados: son la fuente de verdad que
  consultan antes de decidir.
- `/plan-feature` y `/create-tests` esperan que el texto tras el comando sea la
  entrada real (descripción o ruta); si va vacío o es demasiado corto, el prompt
  pide aclaración en vez de asumir.
