---
name: api-integration
description: "Use when: implementing how a feature consumes external data (backend/mocks) following the Component → Hook → TanStack Query → API Service → HTTP → MSW/Backend flow. Covers schemas (Zod), query keys, API services, custom hooks, MSW handlers, bootstrap (Providers+MSW init), and testing by layer. Ensures external data is validated before entering the app and components remain decoupled from data sources."
---

# API Integration Procedure

## Purpose

This skill teaches **how to integrate external data into a feature**, not how the architecture works. It provides a reusable, domain-agnostic technical recipe for consuming APIs (via MSW initially, real backend later) that applies to any new endpoint or feature requiring server state.

It complements **[docs/architecture.md](../../docs/architecture.md)** (architecture reference, communication flow), **[.github/copilot-instructions.md](./../copilot-instructions.md)** (global project rules), and **feature-development skill** (workflow for building a complete feature). Do not duplicate architecture documentation — refer to it instead.

---

## When to Use This Skill

- Implementing a new **endpoint** (GET, POST, etc.) within a feature.
- Building **custom hooks** that wrap TanStack Query queries or mutations.
- Writing **API service functions** that validate and parse external data.
- Setting up **MSW handlers** for new routes.
- Determining **test strategy** for each layer (schema, service, hook, component).
- Deciding **where to put code** (api/, hooks/, schemas/ within a feature).
- Handling **loading, error, empty, and invalid-data states** correctly.

**Do not use this skill for:**

- Planning the overall feature structure (use **feature-development** skill instead).
- Architectural planning or violation detection (use **ecommerce-architect** agent).
- General component development (use the component testing patterns in `docs/architecture.md`).

---

## Data Flow Contract

**Unbreakable rule:**

```text
Component
    ↓
Custom Hook
    ↓
TanStack Query (useQuery / useMutation)
    ↓
API Service Function (with validation)
    ↓
HTTP Request
    ↓
MSW / Backend
```

**Key principles:**

1. Components never access `products.json`, fetch directly, or import raw data.
2. All external data is validated with Zod **before** entering the application state.
3. Server state (queries, mutations) is managed by TanStack Query, never `useState`/`useContext`/global stores.
4. MSW simulates HTTP; replacing MSW with a real backend should not require component changes.

**Refer to:** [Comunicación con API](../../docs/architecture.md#comunicación-con-api) in `docs/architecture.md` for visual flow diagram.

---

## Bootstrap: One-Time Setup

### When This Applies

Only needed **once per app** before any feature can use TanStack Query + MSW browser. If `app/providers.tsx` and `mocks/browser.ts` already exist, skip to "Receta por Endpoint".

### One-Time Steps

#### 1. Create `app/providers.tsx`

Wrap the app with `QueryClientProvider`. Initialize MSW browser worker **only in dev/test** before rendering children.

```text
File: app/providers.tsx
Purpose: Initialize QueryClient + MSW browser worker (dev/test only)
```

**Key points:**

- `QueryClient` created once at module scope (singleton).
- MSW browser worker started in `useEffect` with `enableMocking()` (conditional on dev/test).
- Children rendered only after worker is ready (prevent hydration mismatch in Server Components context).

#### 2. Wire Providers into `app/layout.tsx`

Wrap `children` with `<Providers>` to enable queries and MSW browser.

```text
File: app/layout.tsx
Change: Wrap <Providers>{children}</Providers>
```

**Key point:** QueryClientProvider allows `useQuery`/`useMutation` to work in any descendant component.

#### 3. Create `mocks/` folder structure

```text
mocks/
├── browser.ts          (setupWorker + enableMocking fn)
├── handlers/
│   ├── index.ts        (re-export all handlers)
│   ├── products.ts     (example: handlers for /api/products*)
│   └── cart.ts         (future: handlers for /api/cart*)
└── [optional] server.ts (for Node/instrumentation if needed later)
```

**Files:**

- **`mocks/browser.ts`**: Exports `setupWorker()` (MSW API) and `enableMocking()` function.

  ```text
  import { setupWorker } from 'msw/browser';
  import { handlers } from './handlers';

  export const worker = setupWorker(...handlers);

  export async function enableMocking() {
    // Only in dev/test, not production
    if (process.env.NODE_ENV !== 'production') {
      return worker.start({ onUnhandledRequest: 'error' });
    }
  }
  ```

- **`mocks/handlers/index.ts`**: Aggregates all domain handlers.

  ```text
  import productsHandlers from './products';
  import cartHandlers from './cart';

  export const handlers = [
    ...productsHandlers,
    ...cartHandlers,
  ];
  ```

#### 4. Initialize MSW browser

**Option A (Recommended): Client-side auto-start in `app/providers.tsx`**

```text
useEffect(() => {
  enableMocking().catch(err => console.error('MSW setup failed', err));
}, []);
```

**Option B (Vitest integration):** Configure in `vitest.config.ts` or test file setup to start MSW with `setupServer()` for Node environment.

#### 5. Public files (MSW service worker)

Run **once** to generate the MSW service worker in `public/`:

```bash
pnpm msw init public/ --save
```

This creates `public/mockServiceWorker.js`, required by MSW browser to intercept HTTP requests.

### Important: MSW Browser Limitations

⚠️ **MSW browser (`mocks/browser.ts`) intercepts **client-side fetch** only.** Server Components in Next.js 13+ that fetch on the server are NOT intercepted by MSW browser.

**When this matters:**

- **Server-side data fetching** (data fetched in Server Components before rendering) → use MSW Node (`mocks/server.ts` + `instrumentation.ts`) instead.
- **Client-side data fetching** (via hooks in Client Components) → MSW browser works fine.

**For now (early dev):** Use Client Components with TanStack Query hooks (mocked via MSW browser). If you later add Server Components that fetch, create `mocks/server.ts` and configure Next.js `instrumentation.ts` to start the server worker.

---

## Receta por Endpoint Nuevo

Follow this sequence **in order** — each layer is a dependency for the next.

### Step 1: Define Schema (Zod)

**File:** `features/<domain>/schemas/<entity>.schema.ts`

**What it contains:**

- Zod schema for a single entity (e.g., `productSchema`).
- Zod schema for the list (e.g., `productsSchema = z.array(productSchema)`).
- Optional: variants for create/update (e.g., `createProductSchema` omits `id`).
- **Do NOT create a separate `.types.ts` file** — derive TypeScript types directly from schemas using `z.infer<typeof>`.

**Example structure:**

```text
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  available: z.boolean(),
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type Products = z.infer<typeof productsSchema>;
```

**Why:**

- Single source of truth: schema + type in one place.
- Eliminates type/schema drift.
- Zod's `safeParse` used in services ensures runtime validation.

**Tests:** Unit test the schema with valid, invalid, and edge-case data (see "Testing by Layer" section).

---

### Step 2: Define Query Key Factory

**File:** `features/<domain>/api/query-keys.ts`

**What it contains:**

- A factory object (`<entity>Keys`) with nested objects for all, list, detail queries.
- Enables consistent cache invalidation and query deduplication.

**Example:**

```text
export const productsKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => [
    ...productsKeys.all,
    'list',
    filters,
  ] as const,
  detail: (id: string) => [
    ...productsKeys.all,
    'detail',
    id,
  ] as const,
};
```

**Why:**

- TanStack Query cache key normalization (avoid duplicate requests).
- Cache invalidation becomes explicit (`queryClient.invalidateQueries({ queryKey: productsKeys.list() })`).
- Refactoring keys is centralized — no scattered string literals.

**Tests:** None required (key factory is configuration, tested implicitly via hook tests).

---

### Step 3: Implement API Service Functions

**File:** `features/<domain>/api/<entity>.service.ts` (one file per operation or grouped by entity)

**What it contains:**

- Pure functions that fetch from `/api/<endpoint>` and validate response.
- Use `fetch()` directly (no wrapper library needed per instructions).
- **Always** call `response.ok` check and `schema.safeParse()`.
- Throw typed errors if validation fails or HTTP fails.

**Example:**

```text
import { productsSchema, productSchema } from '../schemas';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams(filters ?? {});
  const response = await fetch(`/api/products?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  const result = productsSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid products data: ${result.error.message}`);
  }

  return result.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Product not found: ${id}`);
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const data = await response.json();
  const result = productSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid product data: ${result.error.message}`);
  }

  return result.data;
}
```

**Error handling:**

- Check `response.ok` (true for 200-299, false for 4xx/5xx).
- Distinguish HTTP errors (network, 500) from data validation errors.
- Throw clear, typed errors (string messages; later add custom error class if needed).

**Tests:** Unit test with MSW (`msw/node` setupServer) or actual fixtures (see "Testing by Layer").

---

### Step 4: Implement Custom Hooks

**File:** `features/<domain>/hooks/use-<entity>.ts`

**What it contains:**

- Custom React hooks wrapping `useQuery` or `useMutation` for your entity.
- One hook per operation (e.g., `useProducts`, `useProduct`, `useCreateProduct`).
- Hooks use the service function and query keys from Steps 2–3.
- Transform/compute data as needed (filtering, formatting) without changing the API contract.

**Example:**

```text
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct } from '../api/products.service';
import { productsKeys } from '../api/query-keys';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productsKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id, // Don't fetch if id is undefined
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: (newProduct) => {
      // Invalidate list to refetch after creation
      queryClient.invalidateQueries({ queryKey: productsKeys.list() });
      // Optionally set detail in cache
      queryClient.setQueryData(productsKeys.detail(newProduct.id), newProduct);
    },
  });
}
```

**Key patterns:**

- `queryKey` comes from the factory (Step 2).
- `queryFn` calls the service function (Step 3).
- `enabled` gates queries that depend on external state (don't fetch if required param is missing).
- `onSuccess` invalidates related queries (keep cache consistent).

**Tests:** Integration test with `renderHook` from React Testing Library + MSW or fixtures (see "Testing by Layer").

---

### Step 5: Create MSW Handlers

**File:** `mocks/handlers/<domain>.ts` (e.g., `mocks/handlers/products.ts`)

**What it contains:**

- MSW `http.get()`, `http.post()`, etc. handlers for each endpoint.
- Match query params, path params, and request body as needed.
- Return realistic response (use `data/products.json` or fixtures).
- Support scenarios: loading (delay), error (400/404/500), empty, invalid data.

**Example:**

```text
import { http, HttpResponse, delay } from 'msw';
import products from '../../data/products.json';

export const productsHandlers = [
  // GET /api/products
  http.get('/api/products', async ({ request }) => {
    // Simulate network latency
    await delay(300);

    // Example: ?error=500 to simulate server error
    const url = new URL(request.url);
    if (url.searchParams.get('error') === '500') {
      return HttpResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }

    // Example: ?empty=true to simulate empty list
    if (url.searchParams.get('empty') === 'true') {
      return HttpResponse.json([]);
    }

    // Normal response
    return HttpResponse.json(products);
  }),

  // GET /api/products/:id
  http.get('/api/products/:id', async ({ params }) => {
    await delay(200);

    const product = products.find(p => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),

  // POST /api/products (example for mutations)
  http.post('/api/products', async ({ request }) => {
    const body = await request.json();

    // Simulate validation error
    if (!body.name || body.price < 0) {
      return HttpResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: crypto.randomUUID(),
      ...body,
    };

    return HttpResponse.json(newProduct, { status: 201 });
  }),
];

export default productsHandlers;
```

**Scenarios to support:**

- **Normal (200)**: Return valid data.
- **Empty (200)**: Return empty array (valid but no items).
- **Loading (delay)**: `await delay(ms)` before response.
- **HTTP 400**: Invalid request (malformed body, validation error).
- **HTTP 404**: Resource not found.
- **HTTP 500**: Server error.
- **Invalid data (200 but schema mismatch)**: Return 200 but data doesn't match schema (tests service validation).

**Export and register:** In `mocks/handlers/index.ts`, import and re-export:

```text
import productsHandlers from './products';
export const handlers = [...productsHandlers];
```

**Tests:** Unit test with MSW setupServer or by inspecting handler logic directly (see "Testing by Layer").

---

### Step 6: Consume in Components

**File:** `features/<domain>/components/<ComponentName>.tsx`

**Pattern:**

```text
'use client'; // Client Component (requires TanStack Query)

import { useProduct } from '../hooks/use-products';

export function ProductCard({ id }: { id: string }) {
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>No product found</div>;

  return <div>{product.name} - ${product.price}</div>;
}
```

**Key points:**

- Use `'use client'` to enable React hooks (TanStack Query).
- Component calls the custom hook (Step 4) — never calls service directly or MSW.
- Handle three states: `isLoading`, `error`, `data`.
- Component is data-source agnostic (works with MSW or real API).

---

## Handling Loading, Error, Empty, Invalid Data

### Loading State

**When:** `useQuery({ ... }).isLoading === true` or `isFetching === true`.

**Best practice:**

- Show a skeleton/spinner (reuse `shared/components/` spinners if available, else use Tailwind or shadcn/ui Skeleton).
- Avoid rendering stale data (use `isLoading`, not just `data`).

**Example:**

```text
if (isLoading) return <ProductSkeleton />;
```

### Error State

**When:** `useQuery({ ... }).error` is set (service threw or HTTP failed).

**Best practice:**

- Display error message to user.
- Distinguish user-facing errors (404: "Product not found") from dev-facing (500: "Server error").
- Offer retry option (TanStack Query provides `refetch()` automatically).

**Example:**

```text
if (error) {
  return (
    <div className="error-banner">
      {error.message}
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

### Empty State

**When:** Response is 200, schema valid, but data is empty array (no products) or null (no single item found).

**Best practice:**

- Different from error: empty is valid, error is not.
- Use `data && data.length === 0` (for lists) or `!data` (for single item).
- Show a friendly message ("No products found" vs "Error loading products").

**Example:**

```text
if (!isLoading && (!data || data.length === 0)) {
  return <div>No products available.</div>;
}
```

### Invalid Data

**When:** Response is 200 but `schema.safeParse()` fails in service (should not reach component, but document for reference).

**Best practice:**

- Handled **before** reaching component (caught in service function).
- Service throws error → `useQuery()` receives error → component shows error state.
- Component treats it as error case (no special handling needed).

**Example (in service):**

```text
const result = productsSchema.safeParse(data);
if (!result.success) {
  throw new Error(`Invalid product data: ${result.error.message}`);
  // Error propagates to useQuery().error in component
}
```

---

## Testing by Layer

**Do not test everything at every level.** Follow the matrix below:

| Layer          | Tool                           | Test Type   | What                                                           |
| -------------- | ------------------------------ | ----------- | -------------------------------------------------------------- |
| **schemas**    | Vitest (unit)                  | Unit        | Zod schema with valid, invalid, edge cases.                    |
| **services**   | Vitest (unit)                  | Unit        | API service functions with MSW setupServer or fixtures.        |
| **hooks**      | Vitest + React Testing Library | Integration | Custom hook logic with `renderHook`, MSW, data transformation. |
| **components** | Vitest + React Testing Library | Component   | Component rendering, props, user interactions (not API state). |
| **E2E**        | Playwright                     | E2E         | Critical user flows (search → view → add to cart).             |

### Schema Tests (Unit)

**File:** `features/<domain>/schemas/<entity>.schema.test.ts`

```text
import { describe, it, expect } from 'vitest';
import { productSchema, productsSchema } from './product.schema';

describe('productSchema', () => {
  it('parses valid product', () => {
    const data = {
      id: '1',
      name: 'Test',
      description: 'Desc',
      price: 10,
      available: true,
    };
    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('rejects negative price', () => {
    const data = { ...validProduct, price: -5 };
    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const data = { id: '1' };
    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('productsSchema', () => {
  it('parses array of valid products', () => {
    const data = [validProduct, validProduct];
    const result = productsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('parses empty array', () => {
    const result = productsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
```

### Service Tests (Unit)

**File:** `features/<domain>/api/<entity>.service.test.ts`

Use MSW `setupServer` to mock endpoints:

```text
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { getProducts, getProduct } from './products.service';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('getProducts', () => {
  it('fetches and validates products', async () => {
    server.use(
      http.get('/api/products', () =>
        HttpResponse.json([{ id: '1', name: 'Test', ... }])
      )
    );

    const result = await getProducts();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test');
  });

  it('throws on invalid data', async () => {
    server.use(
      http.get('/api/products', () =>
        HttpResponse.json([{ id: '1' }]) // Missing required fields
      )
    );

    await expect(getProducts()).rejects.toThrow('Invalid products data');
  });

  it('throws on HTTP error', async () => {
    server.use(
      http.get('/api/products', () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    await expect(getProducts()).rejects.toThrow('Failed to fetch');
  });
});

describe('getProduct', () => {
  it('throws on 404', async () => {
    server.use(
      http.get('/api/products/:id', () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    );

    await expect(getProduct('999')).rejects.toThrow('Product not found');
  });
});
```

### Hook Tests (Integration)

**File:** `features/<domain>/hooks/use-<entity>.test.ts`

Use `renderHook` from React Testing Library + MSW:

```text
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProduct } from './use-products';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useProduct', () => {
  it('fetches product by id', async () => {
    server.use(
      http.get('/api/products/1', () =>
        HttpResponse.json({ id: '1', name: 'Test' })
      )
    );

    const { result } = renderHook(() => useProduct('1'), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual({ id: '1', name: 'Test' });
  });

  it('does not fetch if id is undefined', () => {
    const { result } = renderHook(() => useProduct(undefined), { wrapper });
    expect(result.current.isLoading).toBe(false);
  });
});
```

### Component Tests (Component)

**File:** `features/<domain>/components/<Component>.test.tsx`

Focus on rendering, not API logic (API mocked via MSW browser in test setup):

```text
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { ProductCard } from './ProductCard';

const server = setupServer();

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('ProductCard', () => {
  it('renders product data', async () => {
    server.use(
      http.get('/api/products/1', () =>
        HttpResponse.json({ id: '1', name: 'Test Product', price: 10 })
      )
    );

    render(<ProductCard id="1" />, { wrapper });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    server.use(
      http.get('/api/products/1', () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    );

    render(<ProductCard id="1" />, { wrapper });

    expect(await screen.findByText(/error|not found/i)).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

**File:** `e2e/<scenario>.spec.ts`

Test critical user flows end-to-end:

```text
import { test, expect } from '@playwright/test';

test('user can view product list and details', async ({ page }) => {
  // Navigate to products
  await page.goto('/products');

  // Wait for list to load
  await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();

  // Click first product
  await page.locator('[data-testid="product-item"]').first().click();

  // Verify detail page
  await expect(page.locator('h1')).toContainText(/product name|details/i);
});
```

---

## Anti-Patterns: Do Not

### ❌ Component → products.json (Direct File Import)

**Wrong:**

```text
import products from '@/data/products.json';

export function ProductList() {
  return products.map(p => <Product key={p.id} {...p} />);
}
```

**Why:** Tightly couples component to a specific data source. Impossible to replace JSON with API without rewriting component. Violates "components are data-source agnostic."

**Right:** Component → useProducts hook (Step 4).

---

### ❌ Component → fetch() Directly

**Wrong:**

```text
export function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);
  return products.map(p => <Product {...p} />);
}
```

**Why:** No validation, duplicates server-state logic, no deduplication, no cache invalidation, breaks testing (hard to mock).

**Right:** Component → useProducts hook (Step 4).

---

### ❌ Duplicate Server State in useState/useContext/Global Store

**Wrong:**

```text
const [products, setProducts] = useState([]);
const queryResult = useQuery({ queryKey: ['products'], ... });
// Now products exist in TWO places; keeping in sync is manual and error-prone.
```

**Why:** State drift, double-fetching, manual synchronization burden.

**Right:** Use TanStack Query result directly; no additional `useState` for server state.

---

### ❌ Assuming MSW Permanence

**Wrong:**

```text
// Inside a component or hook
if (process.env.NODE_ENV === 'development') {
  // Specific to MSW; breaks when MSW replaced by real API
}
```

**Why:** Client should be agnostic of MSW. Code that detects MSW's presence will break when switching to a real backend.

**Right:** No if-checks for MSW. MSW is transparent; it just makes HTTP work the same way in dev as in production.

---

### ❌ Unnecessary HTTP Wrappers

**Wrong:**

```text
// Create an HttpClient wrapper around fetch for this one project
class HttpClient {
  async get(url) { ... }
}
```

**Why:** `fetch()` is standardized. Wrapping it adds abstraction with no concrete benefit (yet). If a need arises (interceptors, auth headers, retry logic), revisit.

**Right:** Use `fetch()` directly in service functions until a concrete need justifies a wrapper.

---

### ❌ Query Keys as Magic Strings

**Wrong:**

```text
useQuery({ queryKey: ['products', id], queryFn: ... });
useQuery({ queryKey: ['products', 'list'], queryFn: ... });
useQuery({ queryKey: ['products', filter], queryFn: ... });
// Key structure scattered throughout codebase; brittle on refactoring.
```

**Why:** Keys scattered = hard to refactor, easy to mistype, cache invalidation is fragile.

**Right:** Use query key factory (Step 2) — all keys centralized in one file.

---

### ❌ No Validation on External Data

**Wrong:**

```text
const { data } = useQuery({ queryFn: async () => {
  const res = await fetch('/api/products');
  return res.json(); // No schema validation; data could be malformed
}});
```

**Why:** Trust external data at your peril. Typos, missing fields, wrong types in the backend payload will crash or confuse the UI.

**Right:** Always validate with Zod before returning (Step 3 service function).

---

### ❌ Business Logic in Components

**Wrong:**

```text
export function ProductList() {
  const [sortOrder, setSortOrder] = useState('asc');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(p => {
      const sorted = p.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
      setProducts(sorted);
    });
  }, [sortOrder]);
  // Component is tangled with sorting logic + data fetching
}
```

**Why:** Hard to test, reuse, or change. Component responsibility bloat.

**Right:** Extract sorting logic to hook or move sort logic to API service; component just renders.

---

## Validation Checklist

Before marking an endpoint integration complete:

- [ ] **Schema defined** (`features/<domain>/schemas/<entity>.schema.ts`) with valid entity and list variants.
- [ ] **Schema type-inferred** (`export type Entity = z.infer<typeof entitySchema>`).
- [ ] **Query key factory created** (`features/<domain>/api/query-keys.ts`).
- [ ] **API service functions** call `fetch()`, check `response.ok`, `safeParse()`, throw clear errors.
- [ ] **Custom hooks wrap TanStack Query** (`useQuery` or `useMutation`), use query keys and services.
- [ ] **MSW handler(s)** created for all endpoints, supports loading/error/empty/invalid scenarios.
- [ ] **Component consumes hook only** (never fetch, never JSON import, never direct service call).
- [ ] **Loading state** handled (skeleton or spinner).
- [ ] **Error state** handled (message + retry option).
- [ ] **Empty state** distinct from error (friendly message, not error styling).
- [ ] **Tests exist by layer:** schema unit tests, service unit tests (with MSW), hook integration tests, component tests (with RTL).
- [ ] **No direct imports from `/data/`** in components.
- [ ] **No `useState` for server state** (TanStack Query manages it).
- [ ] **No process.env checks for MSW** (MSW is transparent).
- [ ] `pnpm typecheck` passes (no `any`, no `@ts-ignore` silencing real errors).
- [ ] `pnpm test:run` passes (all tests green).

---

## Summary

The API integration flow is simple but disciplined:

1. **Bootstrap (once):** `Providers.tsx` + MSW browser + handlers structure.
2. **Per endpoint:** Schema → Query Keys → Service → Hook → MSW Handler → Component (in order).
3. **Validation:** Always Zod-validate external data in the service.
4. **Testing:** Unit-test schemas & services; integration-test hooks; component-test UI rendering.
5. **Consumption:** Components only use hooks; hooks only use services; services only use `fetch()`.

This ensures:

- ✅ External data is validated before entering the app.
- ✅ Components are data-source agnostic (MSW → real API swap is transparent).
- ✅ Server state is managed consistently (TanStack Query, not scattered `useState`).
- ✅ Each layer is testable in isolation.
- ✅ Replacing MSW with a real backend requires zero component changes.

---

## References

- **[docs/architecture.md](../../docs/architecture.md)** — Full architecture, communication flow diagram, state types (Server/Client/URL).
- **[.github/copilot-instructions.md](./../copilot-instructions.md)** — Global project rules, stack, conventions.
- **[.github/skills/feature-development/SKILL.md](../feature-development/SKILL.md)** — How to structure a complete feature (uses this skill for the data layer).
- **[.github/agents/ecommerce-architect.agent.md](../../.github/agents/ecommerce-architect.agent.md)** — Planning and architectural validation (plan before implementing).
- **TanStack Query docs:** https://tanstack.com/query/latest
- **Zod docs:** https://zod.dev
- **MSW docs:** https://mswjs.io
