import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKey';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectIsAuthenticated } from '@/redux/selectors/auth.selectors';
import { setUserAction } from '@/redux/slice/user.slice';
import { getProfile } from '@/services/api/user/user.api';
import { ErrorHandler } from '@/services/errors';

/**
 * Reference query hook: fetch the signed-in profile, cache it, and mirror it into Redux.
 * Pass `enabled: false` when a screen should not load the profile yet.
 */
export const useGetProfile = (enabled = true) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const query = useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: getProfile,
    enabled: enabled && isAuthenticated,
  });

  useEffect(() => {
    if (query.data?.data) {
      dispatch(setUserAction(query.data.data));
    }
  }, [dispatch, query.data]);

  useEffect(() => {
    if (query.error) {
      ErrorHandler(query.error);
    }
  }, [query.error]);

  return query;
};
