import { ToastConfig } from 'react-native-toast-message';
import ToastCard from './ToastCard';

export const toastConfig: ToastConfig = {
  success: props => <ToastCard {...props} type="success" />,
  error: props => <ToastCard {...props} type="error" />,
  info: props => <ToastCard {...props} type="info" />,
  successWithIcon: props => (
    <ToastCard
      {...props}
      type="success"
      leftIcon={props.props?.leftIcon}
      rightIcon={props.props?.rightIcon}
    />
  ),
  errorWithIcon: props => (
    <ToastCard
      {...props}
      type="error"
      leftIcon={props.props?.leftIcon}
      rightIcon={props.props?.rightIcon}
    />
  ),
  infoWithIcon: props => (
    <ToastCard
      {...props}
      type="info"
      leftIcon={props.props?.leftIcon}
      rightIcon={props.props?.rightIcon}
    />
  ),
};
