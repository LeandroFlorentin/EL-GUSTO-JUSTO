import '@testing-library/jest-dom/vitest';

// jsdom no implementa IntersectionObserver; lo necesita `motion` para animaciones `whileInView`.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}

globalThis.IntersectionObserver = MockIntersectionObserver;
