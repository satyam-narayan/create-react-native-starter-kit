import CustomButton from '@/components/shared/CustomButton';
import CustomText from '@/components/shared/text/CustomText';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { hideLoader, showLoader } from '@/redux/slice/loader.slice';
import { layout } from '@/theme/layout';
import { TabScreenProps } from '@/types';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type props = TabScreenProps<'Profile'>;

const Profile = ({ navigation }: props) => {
  const dispatch = useAppDispatch();

  /**
   * Global loader reference: `showLoader()` puts a full-screen overlay on top of the app
   * and `hideLoader()` removes it. Use it for blocking work (submit, upload, delete);
   * use a shimmer (see Home) for first-time screen data instead.
   */
  useEffect(() => {
    const loadData = async () => {
      dispatch(showLoader());

      await new Promise(resolve => setTimeout(resolve as any, 2000));

      dispatch(hideLoader());
    };

    loadData();
  }, [dispatch]);

  const handlePress = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView>
      <CustomText
        variant="header"
        textAlign="center"
        style={layout.marginTopMd}
      >
        Profile Screen
      </CustomText>
      <CustomButton title="Go to Main Tab" onPress={handlePress} />
    </SafeAreaView>
  );
};

export default Profile;
