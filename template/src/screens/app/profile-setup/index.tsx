import CustomButton from '@/components/shared/CustomButton';
import FormInput from '@/components/shared/form-input/FormInput';
import { isIOS } from '@/constants/device';
import { LIMITS } from '@/constants/limits';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUserAction } from '@/redux/slice/user.slice';
import { spacing } from '@/theme';
import { layout } from '@/theme/layout';
import { AppStackScreenProps } from '@/types';
import { profileSetupSchema } from '@/validation/schema/user.schema';
import { tValError } from '@/validation/tValError';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InferType } from 'yup';

type Props = AppStackScreenProps<'ProfileSetup'>;

export type ProfileSetupFormType = InferType<typeof profileSetupSchema>;

const ProfileSetup = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ProfileSetupFormType>({
    defaultValues: {
      name: '',
      phone: '',
      gender: '',
      address: '',
      dob: undefined,
      currentTime: undefined,
    },
    resolver: yupResolver(profileSetupSchema) as Resolver<ProfileSetupFormType>,
  });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {bottom}=useSafeAreaInsets();

  const handleContinue = async (data: ProfileSetupFormType) => {
    console.log('Profile Data:', {
      ...data,
      dob: data.dob.toISOString(),
      currentTime: data.currentTime.toISOString(),
    });
    dispatch(setUserAction({ id: 'user-id', isProfileSetup: true }));
    navigation.replace('BottomTabs', {
      screen: 'Home',
    });
  };
  return (
    <KeyboardAvoidingView
      style={[layout.flexContainer,{paddingBottom:bottom+spacing.sm}]}
      behavior={isIOS ? 'padding' : 'height'}
      keyboardVerticalOffset={isIOS ? 64 : 0}
      contentContainerStyle={{flexGrow:1}}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
      <FormInput
        control={control}
        name="name"
        label={t('user.name')}
        placeholder={t('placeholder.enterName')}
        error={tValError(t, errors.name, {
          field: t('user.name'),
          ...LIMITS.NAME,
        })}
        variant="text"
        // leftIcon={<Icon name="downArrow" size={20} />}
        // rightIcon={<Icon name="downArrow" size={20} />}
        // isPassword
      />

      <FormInput
        control={control}
        name="phone"
        label={t('user.phone-number')}
        placeholder={t('placeholder.enterPhone')}
        error={tValError(t, errors.phone, {
          field: t('user.phone-number'),
          ...LIMITS.PHONE,
        })}
        variant="country-phone"
        // showFlag={false}
        // onChangeSelectedCountry={country => {
        //   console.log('Country:', country);
        //   console.log('Calling code:', country.idd.root); // ← "+91"
        //   console.log('ISO code:', country.cca2); // ← "IN"
        // }}
      />

      <FormInput
        control={control}
        name="gender"
        label={t('user.gender')}
        error={tValError(t, errors.gender, {
          field: t('user.gender'),
        })}
        variant="dropdown"
        dropdownData={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
        placeholder={t('placeholder.select-your-gender')}
      />
      <FormInput
        control={control}
        name="dob"
        label={t('user.date-of-birth')}
        placeholder={t('placeholder.select-your-date-of-birth')}
        error={tValError(t, errors.dob, {
          field: t('user.date-of-birth'),
        })}
        variant="date"
        maximumDate={new Date()}
        // disabled
      />

      <FormInput
        control={control}
        name="currentTime"
        label={t('user.current-time')}
        placeholder={t('placeholder.enter-your-current-time')}
        error={tValError(t, errors.currentTime, {
          field: t('user.current-time'),
        })}
        variant="time"
        iconName="clock"
      />
      <FormInput
        control={control}
        name="address"
        label={t('user.address')}
        placeholder={t('placeholder.enterAddress')}
        error={tValError(t, errors.address, {
          field: t('user.address'),
          ...LIMITS.ADDRESS,
        })}
        variant="text"
        textInputProps={{
          multiline: true,
        }}
      />

    </ScrollView>
      <CustomButton
        title={t('common.continue')}
        onPress={handleSubmit(handleContinue)}
        variant="primary"
        fullWidth
        />
    </KeyboardAvoidingView>
  );
};

export default ProfileSetup;
