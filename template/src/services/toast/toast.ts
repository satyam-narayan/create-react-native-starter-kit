import { IconName } from '@/assets/icons';
import i18n from '@/i18n';
import { showToast, type ToastAction, type ToastVariant } from './toastStore';

type BaseToastArgs = {
  title?: string;
  message?: string;
  action?: ToastAction;
  duration?: number;
};

type IconToastArgs = BaseToastArgs & {
  /** Replaces the status glyph in the left badge. */
  icon?: IconName;
};

type ContextToastArgs = IconToastArgs & {
  thumbnailUri?: string;
};

const show = (
  variant: ToastVariant,
  defaultTitle: string,
  { title, message, action, duration }: BaseToastArgs,
  extra?: { icon?: IconName; thumbnailUri?: string },
) => {
  const resolvedTitle = title ?? defaultTitle;

  if (!resolvedTitle && !message) {
    __DEV__ && console.warn('[Toast] title or message should be provided');
    return;
  }

  showToast({
    variant,
    title: resolvedTitle,
    message,
    action,
    duration,
    ...extra,
  });
};

export const SuccessToast = ({ icon, ...args }: IconToastArgs) =>
  show('success', i18n.t('common.success'), args, { icon });

export const ErrorToast = ({ icon, ...args }: IconToastArgs) =>
  show('error', i18n.t('common.error'), args, { icon });

export const InfoToast = ({ icon, ...args }: IconToastArgs) =>
  show('info', i18n.t('common.info'), args, { icon });

/** "You're offline" toast with a wifi-off glyph. */
export const OfflineToast = (args: BaseToastArgs) =>
  show('offline', i18n.t('network.unavailableTitle'), args);

/** Context toast (clipboard, preview, etc.) with an icon or thumbnail on the left. */
export const ContextToast = ({
  icon,
  thumbnailUri,
  ...args
}: ContextToastArgs) => show('info', '', args, { icon, thumbnailUri });
