import { AuthStackScreenProps } from '@/types';
import React from 'react';
import { View, Text } from 'react-native';

type props = AuthStackScreenProps<'VerifyEmail'>;

const VerifyEmail = ({}: props) => {
  return (
    <View>
      <Text>VerifyEmail Screen</Text>
    </View>
  );
};

export default VerifyEmail;
