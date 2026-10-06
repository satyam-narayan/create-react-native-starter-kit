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
import { InferType } from 'yup';
import { registerSchema } from '@/validation/schema/auth.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { tValError } from '@/validation/tValError';
import { LIMITS } from '@/constants/limits';

type Props = AuthStackScreenProps<'Signup'>;

export type RegisterFormType = InferType<typeof registerSchema>;

const Signup = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
  });

  const { color } = useAppTheme();
  const { t } = useTranslation();

  const onNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={layout.flexContainer}>
      <CustomText
        variant="header"
        weight="600"
        textColor={color.text_primary}
        textAlign="center"
      >
        {t('auth.lets-get-started')}
      </CustomText>
      <FormInput
        control={control}
        name="email"
        placeholder={t('placeholder.enterEmail')}
        label={t('auth.email')}
        textInputProps={{
          keyboardType: 'email-address',
        }}
        error={tValError(t, errors.email, {
          field: t('auth.email'),
          ...LIMITS.EMAIL,
        })}
        variant="text"
      />

      <FormInput
        control={control}
        name="password"
        label={t('auth.password')}
        placeholder={t('placeholder.enterPassword')}
        isPassword
        variant="text"
        error={tValError(t, errors.password, {
          field: t('auth.password'),
          ...LIMITS.PASSWORD,
        })}
      />

      <CustomButton
        title={t('auth.create-account')}
        onPress={handleSubmit(onNavigateToLogin)}
        variant="primary"
        fullWidth
      />

      <View style={layout.flexEnd}>
        <View style={layout.rowGapCenter}>
          <CustomText textColor={color.text_secondary}>
            {t('auth.alreadyHaveAccount')}
          </CustomText>
          <CustomText textColor={color.secondary} onPress={onNavigateToLogin}>
            Login
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

export default Signup;
