# API Integration: Reference Examples

This file contains complete, runnable examples using **products** as the reference domain. Copy and adapt these snippets when integrating a new endpoint or feature.

---

## Table of Contents

1. [Schema (Zod)](#schema-zod)
2. [Query Key Factory](#query-key-factory)
3. [API Service Functions](#api-service-functions)
4. [Custom Hooks](#custom-hooks)
5. [MSW Handlers](#msw-handlers)
6. [Bootstrap: Providers + MSW](#bootstrap-providers--msw)
7. [Component Usage](#component-usage)
8. [Tests by Layer](#tests-by-layer)

---

## Schema (Zod)

**File:** `features/products/schemas/product.schema.ts`

```typescript
import { z } from "zod";

// Single entity
export const productSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  name: z.string().min(1, "Product name is required"),
  description: z.string(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Image must be a valid URL"),
  category: z.string(),
  available: z.boolean(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  createdAt: z.string().datetime("Invalid timestamp"),
});

// List of entities
export const productsSchema = z.array(productSchema);

// Create input (omit id, timestamps)
export const createProductSchema = productSchema.omit({ id: true, createdAt: true });

// Update input (all fields optional)
export const updateProductSchema = productSchema.omit({ id: true, createdAt: true }).partial();

// Infer types
export type Product = z.infer<typeof productSchema>;
export type Products = z.infer<typeof productsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Common filter/query types
export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
};
```

---

## Query Key Factory

**File:** `features/products/api/query-keys.ts`

```typescript
import { ProductFilters } from "../schemas/product.schema";

export const productsKeys = {
  // All product queries
  all: ["products"] as const,

  // List with optional filters
  list: (filters?: ProductFilters) => [...productsKeys.all, "list", filters] as const,

  // Single product detail
  detail: (id: string) => [...productsKeys.all, "detail", id] as const,

  // Search
  search: (query: string) => [...productsKeys.all, "search", query] as const,
};
```

**Usage in hooks:**

```typescript
// Invalidate entire list
queryClient.invalidateQueries({ queryKey: productsKeys.list() });

// Invalidate list with specific filters
queryClient.invalidateQueries({
  queryKey: productsKeys.list({ category: "electronics" }),
});

// Invalidate a single product
queryClient.invalidateQueries({
  queryKey: productsKeys.detail(productId),
});
```

---

## API Service Functions

**File:** `features/products/api/products.service.ts`

```typescript
import { productSchema, productsSchema, createProductSchema } from "../schemas/product.schema";
import type { Product, Products, ProductFilters, CreateProductInput } from "../schemas/product.schema";

// Typed error for better handling
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Fetch all products with optional filters
 */
export async function getProducts(filters?: ProductFilters): Promise<Products> {
  const params = new URLSearchParams();

  if (filters?.category) params.append("category", filters.category);
  if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const url = params.toString() ? `/api/products?${params}` : "/api/products";
  const response = await fetch(url);

  if (!response.ok) {
    throw new APIError(`Failed to fetch products: ${response.statusText}`, response.status);
  }

  const data = await response.json();
  const result = productsSchema.safeParse(data);

  if (!result.success) {
    throw new APIError(`Invalid products data: ${result.error.message}`, 500);
  }

  return result.data;
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product> {
  if (!id) {
    throw new APIError("Product ID is required", 400);
  }

  const response = await fetch(`/api/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new APIError(`Product not found: ${id}`, 404);
    }
    throw new APIError(`Failed to fetch product: ${response.statusText}`, response.status);
  }

  const data = await response.json();
  const result = productSchema.safeParse(data);

  if (!result.success) {
    throw new APIError(`Invalid product data: ${result.error.message}`, 500);
  }

  return result.data;
}

/**
 * Create a new product
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const validated = createProductSchema.safeParse(input);
  if (!validated.success) {
    throw new APIError(`Invalid product input: ${validated.error.message}`, 400);
  }

  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated.data),
  });

  if (!response.ok) {
    throw new APIError(`Failed to create product: ${response.statusText}`, response.status);
  }

  const data = await response.json();
  const result = productSchema.safeParse(data);

  if (!result.success) {
    throw new APIError(`Invalid response data: ${result.error.message}`, 500);
  }

  return result.data;
}

/**
 * Update a product
 */
export async function updateProduct(id: string, updates: Partial<CreateProductInput>): Promise<Product> {
  if (!id) {
    throw new APIError("Product ID is required", 400);
  }

  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new APIError(`Product not found: ${id}`, 404);
    }
    throw new APIError(`Failed to update product: ${response.statusText}`, response.status);
  }

  const data = await response.json();
  const result = productSchema.safeParse(data);

  if (!result.success) {
    throw new APIError(`Invalid response data: ${result.error.message}`, 500);
  }

  return result.data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  if (!id) {
    throw new APIError("Product ID is required", 400);
  }

  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new APIError(`Product not found: ${id}`, 404);
    }
    throw new APIError(`Failed to delete product: ${response.statusText}`, response.status);
  }
}
```

---

## Custom Hooks

**File:** `features/products/hooks/use-products.ts`

```typescript
"use client"; // Required for React hooks in Next.js App Router

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../api/products.service";
import { productsKeys } from "../api/query-keys";
import type { Product, Products, ProductFilters, CreateProductInput, UpdateProductInput } from "../schemas/product.schema";

/**
 * Fetch all products with optional filters
 *
 * @example
 * const { data, isLoading, error } = useProducts({ category: 'electronics' });
 */
export function useProducts(filters?: ProductFilters): UseQueryResult<Products, Error> {
  return useQuery({
    queryKey: productsKeys.list(filters),
    queryFn: () => getProducts(filters),
    // Stale time: 5 minutes before considered stale
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes before garbage collected
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch a single product by ID
 *
 * @example
 * const { data: product } = useProduct(productId);
 */
export function useProduct(id?: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: productsKeys.detail(id ?? ""),
    queryFn: () => getProduct(id!),
    enabled: !!id, // Don't fetch if id is undefined
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Create a new product
 *
 * @example
 * const { mutate, isPending } = useCreateProduct();
 * mutate({ name: 'New Product', ... });
 */
export function useCreateProduct(): UseMutationResult<Product, Error, CreateProductInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: productsKeys.list() });
      // Set new product in cache
      queryClient.setQueryData(productsKeys.detail(newProduct.id), newProduct);
    },
  });
}

/**
 * Update a product
 *
 * @example
 * const { mutate } = useUpdateProduct(productId);
 * mutate({ name: 'Updated Name' });
 */
export function useUpdateProduct(id: string): UseMutationResult<Product, Error, Partial<CreateProductInput>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      // Update cache with new data
      queryClient.setQueryData(productsKeys.detail(id), updatedProduct);
      // Invalidate list to refetch (in case order changed)
      queryClient.invalidateQueries({ queryKey: productsKeys.list() });
    },
  });
}

/**
 * Delete a product
 *
 * @example
 * const { mutate } = useDeleteProduct();
 * mutate(productId);
 */
export function useDeleteProduct(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate list to refetch after deletion
      queryClient.invalidateQueries({ queryKey: productsKeys.list() });
    },
  });
}
```

---

## MSW Handlers

**File:** `mocks/handlers/products.ts`

```typescript
import { http, HttpResponse, delay } from "msw";

// Mock data source (simulating data/products.json)
const mockProducts = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop",
    price: 999.99,
    image: "https://example.com/laptop.jpg",
    category: "electronics",
    available: true,
    stock: 5,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Mouse",
    description: "Wireless mouse",
    price: 29.99,
    image: "https://example.com/mouse.jpg",
    category: "electronics",
    available: true,
    stock: 20,
    createdAt: "2024-01-02T00:00:00Z",
  },
];

export const productsHandlers = [
  /**
   * GET /api/products
   * Fetch all products with optional filters
   */
  http.get("/api/products", async ({ request }) => {
    // Simulate network latency
    await delay(300);

    // Extract query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");

    // Simulate error scenarios via query params
    if (url.searchParams.get("error") === "500") {
      return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Simulate empty result
    if (url.searchParams.get("empty") === "true") {
      return HttpResponse.json([]);
    }

    // Filter products
    let results = mockProducts;

    if (category) {
      results = results.filter((p) => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower));
    }

    if (minPrice !== null) {
      results = results.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== null) {
      results = results.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Pagination
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSize = limit ? parseInt(limit, 10) : 10;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const paginated = results.slice(start, end);

    return HttpResponse.json(paginated);
  }),

  /**
   * GET /api/products/:id
   * Fetch a single product by ID
   */
  http.get("/api/products/:id", async ({ params }) => {
    await delay(200);

    const product = mockProducts.find((p) => p.id === params.id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  /**
   * POST /api/products
   * Create a new product
   */
  http.post("/api/products", async ({ request }) => {
    await delay(400);

    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== "string") {
      return HttpResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    if (typeof body.price !== "number" || body.price < 0) {
      return HttpResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    // Create new product
    const newProduct = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description ?? "",
      price: body.price,
      image: body.image ?? "",
      category: body.category ?? "uncategorized",
      available: body.available ?? true,
      stock: body.stock ?? 0,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  /**
   * PATCH /api/products/:id
   * Update a product
   */
  http.patch("/api/products/:id", async ({ params, request }) => {
    await delay(300);

    const product = mockProducts.find((p) => p.id === params.id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updates = await request.json();

    // Update product (in real app, would update database)
    const updated = { ...product, ...updates };

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /api/products/:id
   * Delete a product
   */
  http.delete("/api/products/:id", async ({ params }) => {
    await delay(300);

    const product = mockProducts.find((p) => p.id === params.id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // In real app, would delete from database
    return HttpResponse.json(undefined, { status: 204 });
  }),
];

export default productsHandlers;
```

**File:** `mocks/handlers/index.ts`

```typescript
import productsHandlers from "./products";
import cartHandlers from "./cart"; // Example for future domain
// import ordersHandlers from './orders';

export const handlers = [
  ...productsHandlers,
  ...cartHandlers,
  // ...ordersHandlers,
];
```

---

## Bootstrap: Providers + MSW

### `app/providers.tsx`

```typescript
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// MSW setup (browser only)
let worker: typeof import('msw/browser').setupWorker | null = null;

async function enableMocking() {
  if (typeof window === 'undefined') {
    // Server-side: skip MSW
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    const { worker: mswWorker } = await import('@/mocks/browser');
    worker = mswWorker;
    return mswWorker.start({
      onUnhandledRequest: 'warn',
    });
  }
}

// Create QueryClient (singleton)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    enableMocking().then(() => {
      setMswReady(true);
    }).catch(err => {
      console.error('Failed to setup MSW:', err);
      setMswReady(true); // Continue even if MSW fails
    });
  }, []);

  if (!mswReady) {
    // Prevent hydration mismatch: wait for MSW to be ready
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### `mocks/browser.ts`

```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (process.env.NODE_ENV !== "production") {
    return worker.start({
      onUnhandledRequest: "warn",
    });
  }
}
```

### `app/layout.tsx` (updated)

```typescript
import { Providers } from './providers';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';

export const metadata = {
  title: 'Sabores',
  description: 'Catering & Eventos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
```

---

## Component Usage

**File:** `features/products/components/ProductCard/ProductCard.tsx`

```typescript
'use client';

import { useProduct } from '../../hooks/use-products';

interface ProductCardProps {
  productId: string;
}

export function ProductCard({ productId }: ProductCardProps) {
  const { data: product, isLoading, error } = useProduct(productId);

  // Loading state
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded" />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-800">Error loading product</p>
        <p className="text-sm text-red-700">{error.message}</p>
      </div>
    );
  }

  // Empty state (no product found)
  if (!product) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">Product not found</p>
      </div>
    );
  }

  // Success state
  return (
    <div className="border rounded p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-bold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">
          {product.available ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </div>
  );
}
```

---

## Tests by Layer

### Schema Tests (Unit)

**File:** `features/products/schemas/product.schema.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { productSchema, productsSchema } from "./product.schema";

describe("productSchema", () => {
  const validProduct = {
    id: "123",
    name: "Test Product",
    description: "A test product",
    price: 99.99,
    image: "https://example.com/image.jpg",
    category: "electronics",
    available: true,
    stock: 5,
    createdAt: "2024-01-01T00:00:00Z",
  };

  it("parses valid product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Test Product");
    }
  });

  it("rejects negative price", () => {
    const invalid = { ...validProduct, price: -10 };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL for image", () => {
    const invalid = { ...validProduct, image: "not-a-url" };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const incomplete = { id: "123" };
    const result = productSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe("productsSchema", () => {
  it("parses array of valid products", () => {
    const data = [
      {
        id: "1",
        name: "Product 1",
        description: "Desc",
        price: 10,
        image: "https://example.com/1.jpg",
        category: "cat1",
        available: true,
        stock: 5,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Product 2",
        description: "Desc",
        price: 20,
        image: "https://example.com/2.jpg",
        category: "cat2",
        available: false,
        stock: 0,
        createdAt: "2024-01-02T00:00:00Z",
      },
    ];

    const result = productsSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });

  it("parses empty array", () => {
    const result = productsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
```

### Service Tests (Unit + MSW)

**File:** `features/products/api/products.service.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { getProducts, getProduct, createProduct } from "./products.service";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getProducts", () => {
  it("fetches and validates products", async () => {
    server.use(
      http.get("/api/products", () =>
        HttpResponse.json([
          {
            id: "1",
            name: "Test Product",
            description: "Desc",
            price: 99.99,
            image: "https://example.com/test.jpg",
            category: "test",
            available: true,
            stock: 5,
            createdAt: "2024-01-01T00:00:00Z",
          },
        ]),
      ),
    );

    const result = await getProducts();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Product");
  });

  it("throws on invalid response data", async () => {
    server.use(
      http.get(
        "/api/products",
        () => HttpResponse.json([{ id: "1" }]), // Missing required fields
      ),
    );

    await expect(getProducts()).rejects.toThrow("Invalid products data");
  });

  it("throws on HTTP 500", async () => {
    server.use(http.get("/api/products", () => HttpResponse.json({ error: "Server error" }, { status: 500 })));

    await expect(getProducts()).rejects.toThrow("Failed to fetch products");
  });
});

describe("getProduct", () => {
  it("throws on HTTP 404", async () => {
    server.use(http.get("/api/products/:id", () => HttpResponse.json({ error: "Not found" }, { status: 404 })));

    await expect(getProduct("999")).rejects.toThrow("Product not found");
  });
});
```

### Hook Tests (Integration)

**File:** `features/products/hooks/use-products.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProduct, useProducts } from './use-products';
import type { ReactNode } from 'react';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useProducts', () => {
  it('fetches products list', async () => {
    server.use(
      http.get('/api/products', () =>
        HttpResponse.json([
          {
            id: '1',
            name: 'Product 1',
            description: 'Desc',
            price: 10,
            image: 'https://example.com/1.jpg',
            category: 'cat1',
            available: true,
            stock: 5,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ])
      )
    );

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe('Product 1');
  });
});

describe('useProduct', () => {
  it('does not fetch if id is undefined', () => {
    const { result } = renderHook(() => useProduct(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('fetches product by id', async () => {
    server.use(
      http.get('/api/products/:id', () =>
        HttpResponse.json({
          id: '1',
          name: 'Product 1',
          description: 'Desc',
          price: 10,
          image: 'https://example.com/1.jpg',
          category: 'cat1',
          available: true,
          stock: 5,
          createdAt: '2024-01-01T00:00:00Z',
        })
      )
    );

    const { result } = renderHook(() => useProduct('1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.name).toBe('Product 1');
  });
});
```

### Component Tests

**File:** `features/products/components/ProductCard/ProductCard.test.tsx`

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from './ProductCard';
import type { ReactNode } from 'react';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ProductCard', () => {
  it('renders loading state', () => {
    server.use(
      http.get('/api/products/:id', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({
          id: '1',
          name: 'Product',
          description: 'Desc',
          price: 10,
          image: 'https://example.com/1.jpg',
          category: 'cat1',
          available: true,
          stock: 5,
          createdAt: '2024-01-01T00:00:00Z',
        });
      })
    );

    render(<ProductCard productId="1" />, { wrapper: Wrapper });
    expect(screen.getByRole('generic')).toHaveClass('animate-pulse');
  });

  it('renders product data', async () => {
    server.use(
      http.get('/api/products/:id', () =>
        HttpResponse.json({
          id: '1',
          name: 'Test Product',
          description: 'A great product',
          price: 99.99,
          image: 'https://example.com/test.jpg',
          category: 'electronics',
          available: true,
          stock: 5,
          createdAt: '2024-01-01T00:00:00Z',
        })
      )
    );

    render(<ProductCard productId="1" />, { wrapper: Wrapper });

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A great product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    server.use(
      http.get('/api/products/:id', () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    );

    render(<ProductCard productId="999" />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/error loading product/i)).toBeInTheDocument();
    });
  });
});
```

---

## Summary

These examples cover the complete integration flow:

1. **Schema** — Zod validation, type inference.
2. **Query Keys** — Centralized cache management.
3. **Services** — Fetch + validate, throw typed errors.
4. **Hooks** — TanStack Query wrappers, invalidation.
5. **MSW** — Simulate HTTP for all scenarios.
6. **Bootstrap** — One-time setup of Providers + MSW.
7. **Component** — Clean UI consuming only hooks.
8. **Tests** — Unit (schemas/services), integration (hooks), component (UI).

Adapt these snippets when building new features or endpoints.
