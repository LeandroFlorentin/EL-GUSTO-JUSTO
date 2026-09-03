import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Evita "cannot configure an already enabled network" cuando el efecto se ejecuta más de una vez (ej. React Strict Mode).
let startPromise: ReturnType<typeof worker.start> | null = null;

export async function enableMocking() {
  //if (process.env.NODE_ENV === 'production') {
  //return;
  //}

  if (!startPromise) {
    startPromise = worker.start({ onUnhandledRequest: 'bypass' });
  }

  return startPromise;
}
