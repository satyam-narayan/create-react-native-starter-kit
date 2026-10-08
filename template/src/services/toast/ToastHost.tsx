import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastCard, { EXIT_DURATION } from './ToastCard';
import {
  type ActiveToast,
  getCurrentToast,
  subscribeToast,
} from './toastStore';

const GAP_BELOW_STATUS_BAR = 8;

/** Mount once at the app root; renders the toast card for `showToast` calls. */
const ToastHost = () => {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ActiveToast | null>(getCurrentToast);
  // The toast that was just hidden, kept mounted while it animates out.
  const [exiting, setExiting] = useState<ActiveToast | null>(null);
  const latest = useRef(toast);

  useEffect(
    () =>
      subscribeToast(next => {
        setExiting(next ? null : latest.current);
        latest.current = next;
        setToast(next);
      }),
    [],
  );

  useEffect(() => {
    if (!exiting) {
      return;
    }
    const timer = setTimeout(() => setExiting(null), EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [exiting]);

  const rendered = toast ?? exiting;
  if (!rendered) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { top: insets.top + GAP_BELOW_STATUS_BAR }]}
    >
      <ToastCard
        key={rendered.id}
        toast={rendered}
        visible={rendered === toast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
});

export default ToastHost;
