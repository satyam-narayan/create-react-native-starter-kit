import type { IconName } from '@/assets/icons';

export type ToastVariant = 'success' | 'error' | 'info' | 'offline';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastConfig = {
  variant: ToastVariant;
  title?: string;
  message?: string;
  /** Replaces the status glyph with an icon (e.g. clipboard). */
  icon?: IconName;
  /** Replaces the status glyph with a small image preview. */
  thumbnailUri?: string;
  /** Button on the right; pressing it also dismisses the toast. */
  action?: ToastAction;
  duration?: number;
};

export type ActiveToast = ToastConfig & { id: number; duration: number };

type Listener = (toast: ActiveToast | null) => void;

export const DEFAULT_TOAST_DURATION = 4000;

let current: ActiveToast | null = null;
let nextId = 1;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach(listener => listener(current));

/** Only one toast is shown at a time; a new one replaces the current one. */
export const showToast = (config: ToastConfig) => {
  current = {
    ...config,
    id: nextId++,
    duration: config.duration ?? DEFAULT_TOAST_DURATION,
  };
  emit();
};

/** Pass an id to hide only that toast (ignored if it was already replaced). */
export const hideToast = (id?: number) => {
  if (!current || (id !== undefined && current.id !== id)) {
    return;
  }
  current = null;
  emit();
};

export const subscribeToast = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getCurrentToast = () => current;
