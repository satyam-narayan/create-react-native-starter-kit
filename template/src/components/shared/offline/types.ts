import type { ReactNode } from 'react';

export type OfflineStateProps = {
  title?: string;
  message?: string;
  showRetry?: boolean;
};

export type OfflineQueryBoundaryProps = {
  /** True when the screen already has data to show (fresh or cached). */
  hasData: boolean;
  /** Shown while there is no data and the device is online (e.g. a shimmer). */
  loading?: ReactNode;
  children: ReactNode;
};
