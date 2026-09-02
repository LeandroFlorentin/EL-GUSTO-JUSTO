---
description: "Analiza código existente y sus tests para agregar únicamente los tests necesarios, usando la Skill testing (Vitest, Testing Library, MSW, Playwright) sin perseguir coverage artificial"
name: "create-tests"
argument-hint: "Ruta, componente, hook, servicio o feature a analizar (ej: features/favorites/hooks/useFavorites.ts)"
agent: "ecommerce-architect"
tools: [read, search, edit, execute, todo]
---

# Creación de Tests Necesarios

Trabaja exclusivamente en agregar tests faltantes para código existente. Nunca modificas código de producción.

## Rol y Entrada

El texto pegado tras este comando (`/create-tests`) **ES la ruta o nombre del código a analizar**. Puede ser:

- Una ruta exacta: `features/favorites/hooks/useFavorites.ts`
- Un componente o carpeta: `FavoriteButton`, `features/products`
- Una capa: `shared/components/Header`

**Si el texto pegado es vacío, demasiado breve, o no es reconocible como una ruta/nombre válido**, detente inmediatamente y pide al usuario que proporcione la ruta o nombre del archivo/componente a analizar.

---

## 1. Investigación Obligatoria (Siguiendo Skill testing)

Antes de escribir tests, debes seguir explícitamente los pasos del [.github/skills/testing/SKILL.md](../skills/testing/SKILL.md) Decision Workflow:

### 1.1. Inspeccionar el Código Objetivo

- Lee el archivo o carpeta indicado por el usuario (si es una carpeta, inspecciona la estructura).
- Identifica todas las dependencias directas: tipos, schemas Zod, servicios, hooks relacionados.
- Entiende qué hace el código (entrada, salida, interacciones externas).

### 1.2. Inspeccionar Tests Existentes

- Busca archivos `.test.ts`, `.test.tsx` colocados junto al código objetivo.
- Revisa `e2e/` si existe, buscando specs Playwright que cubran flujos donde aparece este código.
- Identifica exactamente qué comportamientos ya están cubiertos.

### 1.3. Clasificar Responsabilidad

Usa la tabla "Changed Responsibility → Primary test level" de la skill para clasificar el código:

| Responsabilidad                        | Nivel primario     | Observación                            |
| -------------------------------------- | ------------------ | -------------------------------------- |
| Utilidad pura, transformación, cálculo | Vitest unit        | Inputs/outputs sin React ni HTTP       |
| Schema Zod                             | Vitest unit        | Límite de validación de datos externos |
| Servicio API                           | Vitest + MSW       | HTTP + request/response handling       |
| Hook TanStack Query                    | Vitest + RTL + MSW | `renderHook`, query state, contrato    |
| Componente presentación                | Vitest + RTL       | Rendering e interacción                |
| Componente con datos                   | Vitest + RTL + MSW | Loading, error, empty scenarios        |
| Flujo crítico multi-page               | Playwright         | Navegación, integración completa       |

### 1.4. Identificar Comportamiento Observable

Describe cada comportamiento como un outcome visible para un usuario o consumer, no detalles internos.

**Ejemplos buenos:**

- "valida que un email sea requerido al enviar el formulario"
- "muestra lista vacía cuando la respuesta no contiene items"
- "reintenta una solicitud fallida cuando el usuario hace clic en 'Reintentar'"

**Evita:**

- "llama a `setLoading(true)`"
- "actualiza `productId` en el estado"
- "renderiza el div número 3"

### 1.5. Determinar Riesgo

Evalúa si el código toca:

- Dinero, transacciones, checkout → **Alto riesgo**
- Autenticación, autorización → **Alto riesgo**
- Acciones irreversibles (eliminar, cancelar) → **Alto riesgo**
- Flujo crítico del negocio → **Riesgo medio-alto**
- Transformación, formateo, validación → **Riesgo medio**
- Presentación estática → **Riesgo bajo**

### 1.6. Elegir el Nivel Mínimo Suficiente

Usa el árbol de decisión de la skill:

```text
¿El código es una función pura?
  Sí → Vitest unit test
  No → ¿El comportamiento se prueba sin navegación del navegador?
    Sí → Vitest + React Testing Library
    No → ¿Cruza el límite HTTP?
      Sí → Usa MSW en ese límite
    ¿Requiere múltiples páginas, features o comportamiento del navegador?
      Sí → Playwright E2E
```

---

## 2. Matriz de Análisis (Obligatoria — Mostrada Antes de Implementar)

Genera y **MUESTRA AL USUARIO** (no solo internamente) una tabla que resuma todas las decisiones:

```
| Behavior | Risk | Test Type | Existing Coverage | Action |
|----------|------|-----------|-------------------|--------|
| [behavior observable] | [Alto/Medio/Bajo] | [Vitest/RTL/MSW/Playwright] | [existing test o "None"] | [Implement/Skip/Blocked] |
```

Donde `Action` puede ser:

- **Implement**: agregará un test nuevo para este comportamiento
- **Skip — already covered**: existe un test que lo cubre
- **Skip — low risk/static**: riesgo bajo sin necesidad de test (ej. contenido estático con una sola rama)
- **Skip — duplicate**: sería duplicado de otra cobertura a nivel más bajo
- **Blocked — requires production change**: necesitaría cambiar código de producción, no se implementa

**Implementa solamente las filas con `Action = Implement`.**

---

## 3. Restricciones Explícitas

### 3.1. Alcance de Edición (Solo Tests)

- ✅ Crear/modificar archivos `.test.ts`, `.test.tsx`
- ✅ Crear/modificar specs en `e2e/` si es necesario (Playwright)
- ✅ Actualizar barrel exports en `e2e/index.ts` o similar, si es necesario para incluir el nuevo spec

- ❌ **NUNCA** modificar código de producción
- ❌ **NUNCA** agregar roles, aria-labels, clases CSS, o selectores al código de producción "para poder testear"

Si un test necesitara cambios en producción (ej. rol faltante, aria-label ausente):

- **NO edites producción**
- Reporta exactamente qué falta en la sección `# Intentionally Not Tested` con motivo: "Blocked — requires `aria-label` en [archivo]:[línea]"

### 3.2. Evitar Coverage Artificial

No agregues tests para:

- Aumentar porcentaje de coverage sin identificar un comportamiento o riesgo real
- Implementación interna (variables privadas, orden de llamadas internas, mocks de internals de la app)
- Estado privado de React o internals de TanStack Query
- Estructura del DOM exacta, clases CSS o snapshots amplios sin assertions conductuales
- Contenido estático con una sola rama de código
- Comportamiento de librerías ya testeado por React, TanStack Query, Zod, Testing Library, MSW o Playwright

### 3.3. No Duplicar

Si un comportamiento ya está cubierto en:

- Un test unitario de la utilidad que llama
- Un test de componente que lo integra
- Un spec Playwright que lo incluye implícitamente

**No lo repitas** en otro nivel. Ejemplo:

- "cálculo de precio con descuento" → test unitario en `calculateDiscount.test.ts`
- No agregues el mismo cálculo testeado en `ProductCard.test.tsx` ni en E2E

### 3.4. Preferir Comportamiento sobre Implementación

Escribe tests que afirmen:

- `expect(screen.getByRole("button")).toBeDisabled()` ← conducta observable
- `expect(onSubmit).toHaveBeenCalledWith({ ... })` ← contrato público

NO assertions sobre:

- `expect(component.state.isLoading).toBe(true)` ← privado
- `expect(queryClient.getQueryState(...)).toBe(...)` ← internal de TanStack Query
- `expect(wrapper.find("div").length).toBe(3)` ← estructura DOM

### 3.5. Mapeo de Niveles de Testing

- **Vitest unit** → Lógica pura (transformaciones, validación, cálculos, utilidades)
- **Testing Library (RTL)** → Componentes, rendering, interacción del usuario (click, type, select)
- **MSW** → Comunicación HTTP; **no es un reemplazo** de tests de unit/componente sino el límite que controlan
- **Playwright** → Flujos críticos que requieren navegación de navegador, múltiples páginas, integración real
  - Solo si `playwright.config.ts` existe en el repo
  - Si no existe, reportar como `E2E: no disponible` sin intentar ejecutar

---

## 4. Ejecución de Tests Agregados

Después de crear/modificar archivos `.test.ts(x)` según la matriz:

### 4.1. Correr Vitest Sobre los Archivos Afectados

```bash
pnpm vitest run <ruta-a-test-afectada>
```

Ejemplos:

- `pnpm vitest run features/favorites/hooks/useFavorites.test.ts`
- `pnpm vitest run shared/components/Header/`
- `pnpm vitest run features/products/` (toda la carpeta si se modificaron varios)

**Resultado esperado**: ✅ Todos los tests pasan.

### 4.2. Correr Playwright (Solo Si Aplica)

**Antes de ejecutar:**

- Verifica si existe `playwright.config.ts` en la raíz del repo.
- Si **NO existe**: reporta en `# Test Results` como `E2E: no disponible (falta playwright.config.ts)`, sin intentar ejecutar.
- Si **SÍ existe** y agregaste un spec Playwright: ejecuta solo ese spec:

```bash
pnpm test:e2e -- <ruta-a-spec>
```

**Resultado esperado** (si se ejecuta): ✅ El spec pasa.

### 4.3. Reportar Fallos

Si cualquier comando retorna error:

- **Reporta el comando exacto** que se ejecutó.
- **Reporta el output completo o resumen del error** (no ocultes detalles).
- **No declares el trabajo como "completado"** si hay ❌ en tests requeridos.
- Documenta en `# Test Results` qué necesita corrección (puede quedar pendiente de que el usuario corrija el código de producción o re-analice).

---

## 5. Formato de Salida (5 Secciones Fijas)

Al finalizar, responde con **exactamente estas 5 secciones**, en este orden. Todos los encabezados en **inglés**.

### # Tested Behaviors

Lista los comportamientos observables cubiertos (nuevos + referencias a tests existentes relevantes). Incluye el nivel de test y escenarios (happy path, error, loading, empty, interacción, etc.).

Ejemplo:

```
- **Valida que email sea requerido** (Vitest unit, schema + service test): happy path con email válido, error con email ausente.
- **Muestra cargando mientras se obtienen favoritos** (Vitest + RTL + MSW): loading state visible antes de que la query resuelva.
- **Reintenta solicitud fallida** (RTL + MSW): click en botón "Reintentar", MSW retorna éxito, lista se actualiza.
- **Muestra lista vacía cuando no hay items** (RTL + MSW): respuesta HTTP válida pero array vacío, UI muestra "Sin favoritos".
```

### # Tests Created

Lista de rutas exactas de archivos nuevos `.test.ts(x)` o specs `e2e/*.spec.ts`, o `Ninguno`.

Ejemplo:

```
- features/favorites/hooks/useFavorites.test.ts
- features/favorites/components/FavoriteButton/FavoriteButton.test.tsx
- e2e/favorites.spec.ts
```

### # Tests Modified

Lista de rutas exactas de archivos de test **existentes** que fueron modificados (agregadas nuevas suites o casos), o `Ninguno`.

Ejemplo:

```
- shared/components/ProductCard/ProductCard.test.tsx → Agregadas 2 suites: "FavoriteButton integration" y "error boundary"
- e2e/products.spec.ts → Agregado escenario "agregar a favoritos desde página de producto"
```

### # Intentionally Not Tested

Filas de la matriz con `Action = Skip` o `Blocked`, con razón concreta y explicación breve. O `Ninguno`.

Ejemplo:

```
- "Renderiza banner de promoción" → Skip — bajo riesgo, contenido estático sin lógica
- "Calcula descuento en carrito" → Skip — already covered en calculateDiscount.test.ts unit test
- "Incrementa contador de visualizaciones en servidor" → Blocked — requires GET endpoint mock en MSW que aún no existe; requiere coordinación con backend
```

### # Test Results

Resumen de la ejecución: comando(s) ejecutado(s) exactos y resultado ✅/❌.

Ejemplo:

```
✅ pnpm vitest run features/favorites/hooks/useFavorites.test.ts
   → 3 tests passed (3 new)

✅ pnpm vitest run features/favorites/components/
   → 2 tests passed (2 new)

✅ pnpm vitest run e2e/favorites.spec.ts
   → 1 test passed (1 new, Playwright)

Todos los tests nuevos pasan exitosamente.
```

O si falla:

```
❌ pnpm vitest run features/favorites/hooks/useFavorites.test.ts
Error: Expected `getFavorites()` to resolve with valid schema but got:
  { id: "abc" } (missing required field 'name')

→ Requiere que el usuario revise el schema o el servicio mock en MSW.
```

---

## Checklist de Validación Antes de Finalizar

Antes de considerar el trabajo completado:

- [ ] Se siguió explícitamente el Decision Workflow de [.github/skills/testing/SKILL.md](../skills/testing/SKILL.md)
- [ ] Se generó y mostró la matriz de análisis (Behavior | Risk | Test Type | Existing Coverage | Action)
- [ ] Cada test creado protege un comportamiento observable o contrato público, no implementación interna
- [ ] El nivel de test es el más bajo que puede probar cada comportamiento con confianza
- [ ] Happy path y escenarios relevantes (loading, error, empty, invalid data, interacción, flujo crítico) fueron evaluados
- [ ] MSW se usó para modelos HTTP, no para mocks innecesarios de servicios/hooks de la app
- [ ] El mismo comportamiento no se testea innecesariamente en múltiples niveles
- [ ] Se reutilizaron utilidades, fixtures y handlers MSW existentes del repo
- [ ] Nunca se modificó código de producción, solo archivos `.test.ts(x)` y `e2e/`
- [ ] Se ejecutaron los tests con `pnpm vitest run <ruta>` (o `pnpm test:e2e` si aplica) y todos pasaron
- [ ] Se reportó el resultado en `# Test Results` con comando exacto y ✅/❌

---

## Qué NO Hacer

No agiles tests para:

- Aumentar porcentaje de coverage sin un riesgo o comportamiento identificado.
- Detalles privados de React, TanStack Query o frameworks.
- Snapshots amplios sin assertions conductuales.
- Contenido completamente estático.
- Comportamiento ya probado por librerías externas.
- Implementación interna cuando una prueba a nivel más alto es suficiente.

No modifiques código de producción bajo ninguna circunstancia. Si necesitas un cambio en producción para que un test funcione, reportalo en `# Intentionally Not Tested` con la razón "Blocked".
