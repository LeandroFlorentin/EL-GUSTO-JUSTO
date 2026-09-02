---
description: "Planifica una nueva feature o cambio significativo del ecommerce sin implementar codigo"
name: "plan-feature"
argument-hint: "Descripcion de la feature, por ejemplo: Implementar favoritos persistidos localmente"
agent: "ecommerce-architect"
tools: [read, search, todo]
---

# Planificacion de Feature

Trabaja exclusivamente en modo de planificacion. No implementes codigo, no crees,
modifiques o elimines archivos, no ejecutes comandos y no generes diffs. La descripcion
escrita por el usuario despues de `/plan-feature` es el requerimiento que debes analizar.

## Investigacion Obligatoria

Antes de redactar el plan, inspecciona y contrasta, en este orden:

1. El requerimiento recibido: identifica objetivo, alcance, datos, acciones y estado
   implicados. Declara cualquier ambiguedad relevante como una decision o riesgo.
2. [La arquitectura](../../docs/architecture.md), fuente de verdad para capas, estado,
   flujo de datos y calidad.
3. [Las instrucciones globales](../copilot-instructions.md).
4. La feature o dominio afectado. Si existe `features/<dominio>/`, inspeccionalo; si no,
   inspecciona `shared/components/` y `shared/layouts/` para detectar las convenciones
   actuales.
5. El codigo relacionado con los datos, componentes, rutas, hooks o servicios afectados.
6. Los tests existentes relacionados para identificar patrones y cobertura ya disponible.

No asumas que una ruta, archivo, capa, dependencia o patron existe sin verificarlo en el
workspace. Consulta tambien, cuando corresponda, la guia de
[desarrollo de features](../skills/feature-development/SKILL.md), la de
[integracion API](../skills/api-integration/SKILL.md) y la de
[testing](../skills/testing/SKILL.md).

## Reglas del Plan

- Reutiliza primero los patrones y componentes existentes; no propongas abstracciones
  prematuras ni dependencias nuevas sin una necesidad verificada.
- Propone solo las capas necesarias. No crees por defecto `api/`, `components/`, `hooks/`,
  `schemas/` y `types/` si el requerimiento no las necesita.
- Respeta la direccion `app -> features -> shared`; los componentes no acceden a datos
  externos directamente.
- Diferencia de forma explicita los archivos nuevos, modificados y eliminados. Si una
  categoria no aplica, indicala como `Ninguno`.
- Cuando haya contradicciones entre instrucciones, arquitectura y codigo existente,
  exponlas como riesgo o decision sin resolverlas unilateralmente.

## Formato de Salida

Responde exactamente con estas secciones, en este orden:

# Requirement

Resume el requerimiento, alcance y ambiguedades verificables.

# Existing Architecture Analysis

Explica las convenciones, restricciones y codigo existente relevantes que confirmaste.

# Affected Domain

Identifica si se extiende un dominio existente o se crea uno nuevo, con su justificacion.

# Data Flow

Describe el flujo completo que aplique, incluyendo Component -> Hook -> TanStack Query ->
API Service -> HTTP -> MSW/Backend para datos externos, o justifica por que no aplica.

# Files to Create

Lista rutas concretas de archivos nuevos y el proposito de cada una, o `Ninguno`.

# Files to Modify

Lista rutas concretas de archivos existentes a modificar y el cambio previsto, o `Ninguno`.

## Files to Delete (if applicable)

Lista rutas a eliminar y su justificacion, o `Ninguno`.

# Implementation Steps

Proporciona una lista numerada de pasos atomicos, concretos y ejecutables secuencialmente
por otro agente. Incluye las rutas afectadas y ordena las capas segun corresponda:
types/schemas, API, hooks, componentes, composicion en `app/` y tests.

# Testing Strategy

Indica los tests unitarios, de componentes o E2E necesarios por cada capa afectada, los
escenarios observables y los tests existentes que se reutilizaran o extenderan.

# Risks / Decisions

Registra riesgos, decisiones de alcance, dependencias potenciales y contradicciones
detectadas que requieran confirmacion.

# Definition of Done

Incluye criterios verificables: comportamiento planificado cubierto, tests necesarios,
`pnpm typecheck`, `pnpm test:run`, `pnpm lint-staged`, validacion de capas/dependencias y
ausencia de carpetas o abstracciones innecesarias.

No cierres con implementacion, codigo ni instrucciones para editar archivos. Este prompt
solo entrega el plan para que otro agente lo ejecute despues de que sea aprobado.
