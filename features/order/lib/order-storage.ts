import { type OrderStorageState, orderStorageSchema } from '@/features/order/schemas/order-storage.schema';

export const ORDER_STORAGE_KEY = 'mama:order';

export const loadOrderState = (): OrderStorageState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = orderStorageSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export const saveOrderState = (state: OrderStorageState) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private browsing, quota, etc.) — ignore
  }
};

export const clearOrderState = () => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(ORDER_STORAGE_KEY);
  } catch {
    // storage unavailable — ignore
  }
};
