import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Pause fetches while offline; serve cache when available. */
      networkMode: 'online',
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 2,
    },
    mutations: {
      /**
       * 'online' would pause mutations offline and leave isPending stuck true.
       * The axios offline guard rejects immediately instead, so the UI recovers.
       */
      networkMode: 'always',
    },
  },
});
