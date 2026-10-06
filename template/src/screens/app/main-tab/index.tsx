import CustomButton from '@/components/shared/CustomButton';
import CustomText from '@/components/shared/text/CustomText';
import AlertModal from '@/components/shared/modal/common/AlertModal';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logoutAction } from '@/redux/slice/auth.slice';
import { persistor } from '@/store';
import { layout } from '@/theme/layout';
import { AppStackScreenProps } from '@/types';
import React, { useState } from 'react';
import { View } from 'react-native';

type props = AppStackScreenProps<'MainTabs'>;

const MainTabs = ({ navigation }: props) => {
  const dispatch = useAppDispatch();
  const { color } = useAppTheme();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    dispatch(logoutAction());
    await persistor.purge();
  };
  const handleGoToHome = () => {
    navigation.navigate('BottomTabs', {
      screen: 'Home',
    });
  };

  return (
    <View>
      <CustomText
        variant="header"
        textAlign="center"
        style={layout.marginTopMd}
      >
        Main Tabs Screen
      </CustomText>
      <CustomButton
        onPress={handleGoToHome}
        title="Go to Home"
        containerStyle={layout.marginBottomMd}
      />
      <CustomButton onPress={() => setIsAlertOpen(true)} title="Logout" />

      <AlertModal
        title="Are you sure want to Logout?"
        isOpen={isAlertOpen}
        description="This will clear all your data and you will need to login again."
        primaryButton={{
          title: 'Yes',
          variant: 'primary',
        }}
        secondaryButton={{
          title: 'Cancel',
          variant: 'outline',
          overrideVariantColor: color.border,
          overrideVariantTextColor: color.text_secondary,
        }}
        icon="clock"
        onPressPrimaryBtn={() => {
          setIsAlertOpen(false);
          handleLogout();
        }}
        onPressSecondaryBtn={() => {
          setIsAlertOpen(false);
        }}
      />
    </View>
  );
};

export default MainTabs;
