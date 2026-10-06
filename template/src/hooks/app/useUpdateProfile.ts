import i18n from '@/i18n';
import { QUERY_KEYS } from '@/constants/queryKey';
import { updateProfile } from '@/services/api/user/user.api';
import { ErrorHandler } from '@/services/errors';
import { SuccessToast } from '@/services/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: res => {
      SuccessToast({
        title: res.message || i18n.t('profile.updateSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] });
    },
    onError: ErrorHandler,
  });
};
