import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import OfflineState from './OfflineState';
import type { OfflineQueryBoundaryProps } from './types';

/**
 * - has data (online or offline) → children
 * - no data + offline → offline UI
 * - no data + online → loading
 */
const OfflineQueryBoundary = ({
  hasData,
  loading = null,
  children,
}: OfflineQueryBoundaryProps) => {
  const { isOffline } = useNetwork();

  if (hasData) {
    return <>{children}</>;
  }

  return isOffline ? <OfflineState /> : <>{loading}</>;
};

export default OfflineQueryBoundary;
