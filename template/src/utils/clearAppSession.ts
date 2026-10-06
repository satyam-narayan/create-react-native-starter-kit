import { logoutAction } from '@/redux/slice/auth.slice';
import { queryClient } from '@/services/query/queryClient';
import { persistor, store } from '@/store';

/** Clears Redux, React Query cache, and persisted storage. */
export const clearAppSession = async () => {
  store.dispatch(logoutAction());
  queryClient.clear();
  await persistor.purge();
};
