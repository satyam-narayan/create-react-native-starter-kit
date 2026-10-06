import CustomButton from '@/components/shared/CustomButton';
import FormInput from '@/components/shared/form-input/FormInput';
import { AuthStackScreenProps } from '@/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { layout } from '@/theme/layout';
import { View } from 'react-native';
import { InferType } from 'yup';
import { forgotPasswordSchema } from '@/validation/schema/auth.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { tValError } from '@/validation/tValError';

type Props = AuthStackScreenProps<'ForgotPassword'>;

export type ForgotPasswordFormType = InferType<typeof forgotPasswordSchema>;

const ForgotPassword = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordFormType>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { t } = useTranslation();

  const handleForgotPassword = () => {
    navigation.goBack();
  };

  return (
    <View style={layout.flexContainer}>
      <FormInput
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('placeholder.enterEmail')}
        textInputProps={{
          keyboardType: 'email-address',
        }}
        error={tValError(t, errors.email, {
          field: t('auth.email'),
        })}
        variant="text"
      />

      <CustomButton
        title={t('auth.send-now')}
        onPress={handleSubmit(handleForgotPassword)}
        variant="primary"
        fullWidth
      />
    </View>
  );
};

export default ForgotPassword;
