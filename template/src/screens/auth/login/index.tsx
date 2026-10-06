import CustomButton from '@/components/shared/CustomButton';
import CustomText from '@/components/shared/text/CustomText';
import FormInput from '@/components/shared/form-input/FormInput';
import { useAppTheme } from '@/context/ThemeContext';
import { AuthStackScreenProps } from '@/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { layout } from '@/theme/layout';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginAction } from '@/redux/slice/auth.slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/validation/schema/auth.schema';
import { tValError } from '@/validation/tValError';
import { InferType } from 'yup';
import { LIMITS } from '@/constants/limits';

type Props = AuthStackScreenProps<'Login'>;

export type LoginFormType = InferType<typeof loginSchema>;

const Login = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
  });

  const { color } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onNavigateToSignup = () => {
    navigation.navigate('Signup');
  };
  const onNavigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = () => {
    dispatch(loginAction({ access_token: 'dummy_token' }));
  };

  return (
    <SafeAreaView style={layout.flexContainer}>
      <CustomText
        variant="header"
        weight="600"
        textColor={color.text_primary}
        textAlign="center"
      >
        {t('auth.welcome-back')}
      </CustomText>
      <FormInput
        control={control}
        name="email"
        //If you don't want to use validation schema, you can add rules like this
        // rules={rules.email}
        label={t('auth.email')}
        placeholder={t('placeholder.enterEmail')}
        textInputProps={{
          keyboardType: 'email-address',
        }}
        error={tValError(t, errors.email, {
          field: t('auth.email'),
        })}
        variant="text"
        isTooltip
        tooltipMessage='We"ll never share your email with anyone else.'
      />

      <FormInput
        control={control}
        name="password"
        label={t('auth.password')}
        placeholder={t('placeholder.enterPassword')}
        error={tValError(t, errors.password, {
          field: t('auth.password'),
          ...LIMITS.PASSWORD,
        })}
        isPassword
        variant="text"
        // isTooltip
        // tooltipMessage="Make sure your password is strong and secure."
      />

      <CustomButton
        title={t('auth.login')}
        onPress={handleSubmit(handleLogin)}
        variant="primary"
        fullWidth
      />

      <View style={layout.rowGapCenter}>
        <CustomText textColor={color.text_secondary}>
          {t('auth.forgotPassword')}
        </CustomText>
        <CustomText
          textColor={color.secondary}
          onPress={onNavigateToForgotPassword}
        >
          {t('auth.reset')}
        </CustomText>
      </View>

      <View style={layout.flexEnd}>
        <View style={layout.rowGapCenter}>
          <CustomText textColor={color.text_secondary}>
            {t('auth.dont-have-an-account')}
          </CustomText>
          <CustomText textColor={color.secondary} onPress={onNavigateToSignup}>
            {t('auth.create-account')}
          </CustomText>
        </View>

        <View style={[layout.separator, { backgroundColor: color.border }]} />

        <CustomText textColor={color.text_secondary} textAlign="center">
          {t('auth.by-continuing-you-agree-to-our')}{' '}
          <CustomText textColor={color.text_primary} onPress={() => {}}>
            {t('auth.terms-of-service')}
          </CustomText>{' '}
          and{' '}
          <CustomText textColor={color.text_primary} onPress={() => {}}>
            {t('auth.privacy-policy')}
          </CustomText>
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

export default Login;
