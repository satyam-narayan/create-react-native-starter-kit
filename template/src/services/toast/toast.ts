import Toast, { ToastShowParams } from 'react-native-toast-message';
import { IconName } from '@/assets/icons';
import i18n from '@/i18n';

type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  { [K in Keys]-?: Required<Pick<T, K>> }[Keys];

type IconProps = {
  leftIcon?: IconName;
  rightIcon?: IconName;
};

type BaseToastArgs = {
  title?: string;
  message?: string;
};

type ToastWithIconArgs = BaseToastArgs & {
  icons: AtLeastOne<IconProps>;
};

const DEFAULT_OPTIONS: Omit<ToastShowParams, 'props' | 'type'> = {
  position: 'top' as const,
  visibilityTime: 4000,
  autoHide: true,
  topOffset: 50,
  avoidKeyboard: true,
};

const showToast = (
  type: ToastShowParams['type'],
  defaultTitle: string,
  args: BaseToastArgs,
  icons?: ToastWithIconArgs['icons'],
) => {
  const resolvedTitle = args.title ?? defaultTitle;

  if (!resolvedTitle && !args.message) {
    __DEV__ && console.warn('[Toast] title or message should be provided');
    return;
  }

  Toast.show({
    ...DEFAULT_OPTIONS,
    type,
    text1: resolvedTitle,
    text2: args.message,
    props: icons,
  });
};

export const SuccessToast = (args: BaseToastArgs) =>
  showToast('success', i18n.t('common.success'), args);

export const ErrorToast = (args: BaseToastArgs) =>
  showToast('error', i18n.t('common.error'), args);

export const InfoToast = (args: BaseToastArgs) =>
  showToast('info', i18n.t('common.info'), args);

export const SuccessToastWithIcon = (args: ToastWithIconArgs) =>
  showToast('successWithIcon', i18n.t('common.success'), args, args.icons);

export const ErrorToastWithIcon = (args: ToastWithIconArgs) =>
  showToast('errorWithIcon', i18n.t('common.error'), args, args.icons);

export const InfoToastWithIcon = (args: ToastWithIconArgs) =>
  showToast('infoWithIcon', i18n.t('common.info'), args, args.icons);
